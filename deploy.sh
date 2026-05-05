#!/bin/bash
# ==============================================================
# deploy.sh — Script de despliegue de infraestructura
#
# Qué hace este script:
#   1. Valida que el AWS CLI esté configurado
#   2. Sube los módulos de CloudFormation al bucket S3
#      (CloudFormation necesita que los nested stacks estén en S3)
#   3. Despliega el stack principal (master.yaml)
#   4. Muestra los outputs del stack al finalizar
#
# Uso:
#   chmod +x deploy.sh    ← solo la primera vez
#   ./deploy.sh
# ==============================================================

set -e  # Detiene el script si cualquier comando falla

# --------------------------------------------------------------
# Variables — edita solo estas si necesitas cambiar algo
# --------------------------------------------------------------
STACK_NAME="portfolio-prod"
REGION="us-east-1"
TEMPLATES_BUCKET="portafolio-3.0"          # Tu bucket para los templates
PARAMETERS_FILE="parameters/prod.json"
MASTER_TEMPLATE="master.yaml"
MODULES_DIR="modules"

# --------------------------------------------------------------
# Colores para los logs
# --------------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

log()     { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --------------------------------------------------------------
# 1. Validar AWS CLI configurado
# --------------------------------------------------------------
echo ""
echo "=================================================="
echo "  Desplegando infraestructura del Portafolio"
echo "=================================================="
echo ""

log "Verificando credenciales de AWS..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS CLI no está configurado. Corre: aws configure"

log "Cuenta AWS: ${ACCOUNT_ID}"
log "Región: ${REGION}"
log "Stack: ${STACK_NAME}"
echo ""

# --------------------------------------------------------------
# 2. Validar que los templates son válidos antes de subir
# --------------------------------------------------------------
log "Validando templates de CloudFormation..."

# Valida el master
aws cloudformation validate-template \
  --template-body file://${MASTER_TEMPLATE} \
  --region ${REGION} > /dev/null \
  && log "master.yaml ✓" \
  || error "master.yaml tiene errores"

# Valida cada módulo
for template in ${MODULES_DIR}/*.yaml; do
  aws cloudformation validate-template \
    --template-body file://${template} \
    --region ${REGION} > /dev/null \
    && log "${template} ✓" \
    || error "${template} tiene errores"
done

echo ""

# --------------------------------------------------------------
# 3. Subir módulos a S3
# CloudFormation requiere que los nested stacks (módulos)
# estén en S3 — no puede leerlos desde local directamente
# --------------------------------------------------------------
log "Subiendo módulos a S3 (${TEMPLATES_BUCKET}/modules/)..."

aws s3 sync ${MODULES_DIR}/ \
  s3://${TEMPLATES_BUCKET}/modules/ \
  --region ${REGION} \
  --exclude "*" \
  --include "*.yaml"

log "Módulos subidos correctamente"
echo ""

# --------------------------------------------------------------
# 4. Desplegar el stack principal
# --capabilities CAPABILITY_NAMED_IAM es requerido porque
# el stack crea roles y políticas IAM con nombres específicos
# --------------------------------------------------------------
log "Desplegando stack: ${STACK_NAME}..."
echo ""

aws cloudformation deploy \
  --template-file ${MASTER_TEMPLATE} \
  --stack-name ${STACK_NAME} \
  --parameter-overrides file://${PARAMETERS_FILE} \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region ${REGION} \
  --no-fail-on-empty-changeset

echo ""
log "Stack desplegado exitosamente"
echo ""

# --------------------------------------------------------------
# 5. Mostrar outputs del stack
# Aquí verás la URL del sitio, el endpoint del API, etc.
# --------------------------------------------------------------
log "Outputs del stack:"
echo ""

aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --query "Stacks[0].Outputs[*].[OutputKey, OutputValue]" \
  --output table

echo ""
log "Despliegue completado."
echo ""
echo "  Sitio web: https://omargarcia.xyz"
echo ""
