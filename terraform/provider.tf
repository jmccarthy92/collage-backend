# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }

  backend "remote" {
    organization = "brkfst"
    workspaces {
      prefix = "gif-collage-"
    }
  }

  required_version = ">= 0.14.9"
}

data "terraform_remote_state" "clientapp_services" {
  backend = "remote"

  config = {
    organization = "gif-collage"
    workspaces = {
      name = "gif-collage-reactapp-${var.environment == "prod" ? "test" : var.environment}"
    }
  }
}


provider "azurerm" {
  features {}
}
