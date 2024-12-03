import BaseApi from '../base/api.service';

export default class SystemService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.service_uri = {
      baseUrlProduction: process.env.VCA_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VCA_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VCA_LOCAL_SERVICE_URL,
      status: '/status',
    };
    this.settings = args?.settings || {}
  }

  async getStatus (payload) {
    return super.get(payload, this.service_uri.status);
  }
}
