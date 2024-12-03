import BaseApi from '../base/api.service';

export default class CreditCardManagementService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VCA_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VCA_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VCA_LOCAL_SERVICE_URL,
      get: '/card/credit-card/',
      create: '/card/credit-card',
      update: '/card/credit-card',
      delete: '/card/credit-card',
    };
    this.settings = args?.settings || {}
  }

  async getByParameters (payload) {
    return super.getByParameters(payload, {
      endpoint: this.serviceEndpoints.get,
      ...this.settings
    });
  }

  async update (payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings
    });
  }

  async create (payload) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.create,
      ...this.settings
    });
  }

  async delete (payload) {
    return super.delete(payload, {
      endpoint: this.serviceEndpoints.delete,
      ...this.settings
    });
  }
}
