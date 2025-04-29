// tenants.js:

import Tenant from "./tenant.js";

export default class Tenants {
  #tenantClass;
  #tenantMap = new Map();
  #list = [];

  constructor(tenantClass = Tenant) {
    // assign class for tenants
    this.#tenantClass = tenantClass;

    // Bind middleware to preserve context
    this.middleware = this.middleware.bind(this);
  }

  async add(config, services) {
    // ensure the configuration object is passed
    if (!config || typeof config !== "object") {
      throw new Error(`"config" must be a valid object.`);
    }

    // ensure the dservices object is passed
    if (!services || typeof services !== "object") {
      throw new Error(`"services" must be a valid object.`);
    }

    // Pass both config and services to Tenant constructor
    const tenant = new this.#tenantClass(config, services);

    // ensure no errors
    if (tenant.errors.length > 0) {
      throw new Error(`Invalid tenant config: ${tenant.errors.join(", ")}`);
    }

    const domainKey = tenant.domain.toLowerCase();
    if (this.#tenantMap.has(domainKey)) {
      throw new Error(`Tenant with domain "${tenant.domain}" already exists.`);
    }

    // Initialize the tenant services
    await tenant.init();

    // add the new, fully initialized tenant to the array
    this.#list.push(tenant);
    this.#tenantMap.set(domainKey, tenant);

    return tenant;
  }

  async addList(configList, services) {
    if (!Array.isArray(configList)) {
      throw new Error(`"configList" must be an array.`);
    }

    for (const config of configList) {
      await this.add(config, services);
    }
  }

  find(domain) {
    if (typeof domain !== "string") return undefined;
    return this.#tenantMap.get(domain.toLowerCase());
  }

  middleware(req, res, next) {
    const tenant = this.find(req.hostname);

    if (!tenant) {
      console.warn(`[Tenants] No tenant found for: ${req.hostname}`);
      return res.status(404).send("Tenant not found");
    }

    try {
      req.tenant = tenant;
      res.locals = { ...res.locals, ...tenant.site };
      next();
    } catch (err) {
      tenant.logger?.error?.(`[Middleware Error] ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Get the number of tenants
   * @returns {number}
   */
  get length() {
    return this.#list.length;
  }

  /**
   * Get all tenants as a list
   * @returns {Tenant[]}
   */
  get list() {
    return [...this.#list];
  }
}
