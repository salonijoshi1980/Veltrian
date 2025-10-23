import lodash from 'lodash';
const { partial } = lodash;
import regularStripe from 'npm:stripe';
import type Stripe from 'stripe';

const env = process.env;

class StripeError extends Error {
  type: string;
  param: string;

  constructor(message: string, type: string, param: string) {
    super(message);
    this.type = type;
    this.param = param;
  }
}

type SupportedStripeParams =
  | Stripe.Checkout.SessionCreateParams
  | Stripe.Checkout.SessionListParams
  | Stripe.Checkout.SessionRetrieveParams
  | Stripe.Checkout.SessionUpdateParams
  | Stripe.Checkout.SessionExpireParams
  | Stripe.Checkout.SessionListLineItemsParams
  | Stripe.ProductCreateParams
  | Stripe.ProductUpdateParams
  | Stripe.ProductListParams
  | Stripe.CustomerCreateParams
  | Stripe.CustomerUpdateParams
  | Stripe.CustomerListParams
  | Stripe.CustomerRetrieveParams
  | Stripe.PriceCreateParams
  | Stripe.PriceUpdateParams
  | Stripe.PriceListParams
  | Stripe.PaymentIntentCreateParams
  | Stripe.PaymentIntentUpdateParams
  | Stripe.PaymentIntentListParams
  | Stripe.PaymentIntentConfirmParams
  | Stripe.PaymentMethodCreateParams
  | Stripe.PaymentMethodAttachParams
  | Stripe.PaymentMethodDetachParams
  | Stripe.PaymentMethodListParams
  | Stripe.SubscriptionCreateParams
  | Stripe.SubscriptionUpdateParams
  | Stripe.SubscriptionListParams
  | Stripe.InvoiceCreateParams
  | Stripe.InvoiceUpdateParams
  | Stripe.InvoiceListParams
  | Stripe.InvoiceFinalizeInvoiceParams
  | Stripe.InvoicePayParams
  | Stripe.InvoiceVoidInvoiceParams
  | Stripe.ChargeCreateParams
  | Stripe.ChargeUpdateParams
  | Stripe.ChargeListParams
  | Stripe.RefundCreateParams
  | Stripe.RefundListParams
  | Stripe.WebhookEndpointCreateParams
  | { id: string };

interface MakeStripeRequestParams<T extends SupportedStripeParams> {
  path: string;
  projectGroupId: string;
  token: string;
  params: T;
}

async function makeStripeRequest<T extends SupportedStripeParams>({
  path,
  projectGroupId,
  token,
  params,
}: MakeStripeRequestParams<T>) {
  const result = await fetch(`${env.NEXT_PUBLIC_CREATE_API_BASE_URL}/v0/protected/stripe/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      projectGroupId,
      params,
      environment: 'DEVELOPMENT',
    }),
  });
  const data = await result.json();
  if (!result.ok) {
    if (data.error) {
      const { message, type, param } = data.error;
      throw new StripeError(message, type, param);
    }
    throw new Error('An error occurred');
  }
  return data;
}

async function createCheckoutSession(
  projectGroupId: string,
  token: string,
  params: Stripe.Checkout.SessionCreateParams
) {
  const data = await makeStripeRequest({
    path: 'checkout',
    token,
    projectGroupId,
    params,
  });
  return { url: data.url };
}

async function listCheckoutSessions(
  projectGroupId: string,
  token: string,
  params: Stripe.Checkout.SessionListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'checkout/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getCheckoutSession(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'checkout/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updateCheckoutSession(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.Checkout.SessionUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'checkout/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function expireCheckoutSession(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.Checkout.SessionExpireParams = {}
) {
  const data = await makeStripeRequest({
    path: 'checkout/expire',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function listCheckoutSessionLineItems(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.Checkout.SessionListLineItemsParams = {}
) {
  const data = await makeStripeRequest({
    path: 'checkout/line-items',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function createProduct(
  projectGroupId: string,
  token: string,
  params: Stripe.ProductCreateParams
) {
  const data = await makeStripeRequest({
    path: 'products',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listProducts(
  projectGroupId: string,
  token: string,
  params: Stripe.ProductListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'products/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getProduct(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'products/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updateProduct(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.ProductUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'products/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function deleteProduct(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'products/delete',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function createPrice(
  projectGroupId: string,
  token: string,
  params: Stripe.PriceCreateParams
) {
  const data = await makeStripeRequest({
    path: 'prices',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listPrices(
  projectGroupId: string,
  token: string,
  params: Stripe.PriceListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'prices/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getPrice(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'prices/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updatePrice(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.PriceUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'prices/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function createCustomer(
  projectGroupId: string,
  token: string,
  params: Stripe.CustomerCreateParams
) {
  const data = await makeStripeRequest({
    path: 'customers',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listCustomers(
  projectGroupId: string,
  token: string,
  params: Stripe.CustomerListParams
) {
  const data = await makeStripeRequest({
    path: 'customers/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getCustomer(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.CustomerRetrieveParams
) {
  const data = await makeStripeRequest({
    path: 'customers/get',
    token,
    projectGroupId,
    params: {
      id,
      params,
    },
  });
  return data;
}

async function createPaymentIntent(
  projectGroupId: string,
  token: string,
  params: Stripe.PaymentIntentCreateParams
) {
  const data = await makeStripeRequest({
    path: 'payment-intents',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listPaymentIntents(
  projectGroupId: string,
  token: string,
  params: Stripe.PaymentIntentListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'payment-intents/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getPaymentIntent(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'payment-intents/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updatePaymentIntent(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.PaymentIntentUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'payment-intents/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function confirmPaymentIntent(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.PaymentIntentConfirmParams = {}
) {
  const data = await makeStripeRequest({
    path: 'payment-intents/confirm',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function cancelPaymentIntent(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'payment-intents/cancel',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function createSubscription(
  projectGroupId: string,
  token: string,
  params: Stripe.SubscriptionCreateParams
) {
  const data = await makeStripeRequest({
    path: 'subscriptions',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listSubscriptions(
  projectGroupId: string,
  token: string,
  params: Stripe.SubscriptionListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'subscriptions/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getSubscription(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'subscriptions/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updateSubscription(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.SubscriptionUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'subscriptions/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function cancelSubscription(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'subscriptions/cancel',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function createInvoice(
  projectGroupId: string,
  token: string,
  params: Stripe.InvoiceCreateParams
) {
  const data = await makeStripeRequest({
    path: 'invoices',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listInvoices(
  projectGroupId: string,
  token: string,
  params: Stripe.InvoiceListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'invoices/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getInvoice(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'invoices/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updateInvoice(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.InvoiceUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'invoices/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function finalizeInvoice(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.InvoiceFinalizeInvoiceParams = {}
) {
  const data = await makeStripeRequest({
    path: 'invoices/finalize',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function payInvoice(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.InvoicePayParams = {}
) {
  const data = await makeStripeRequest({
    path: 'invoices/pay',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function voidInvoice(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.InvoiceVoidInvoiceParams = {}
) {
  const data = await makeStripeRequest({
    path: 'invoices/void',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function createPaymentMethod(
  projectGroupId: string,
  token: string,
  params: Stripe.PaymentMethodCreateParams
) {
  const data = await makeStripeRequest({
    path: 'payment-methods',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listPaymentMethods(
  projectGroupId: string,
  token: string,
  params: Stripe.PaymentMethodListParams
) {
  const data = await makeStripeRequest({
    path: 'payment-methods/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getPaymentMethod(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'payment-methods/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function attachPaymentMethod(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.PaymentMethodAttachParams
) {
  const data = await makeStripeRequest({
    path: 'payment-methods/attach',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function detachPaymentMethod(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.PaymentMethodDetachParams = {}
) {
  const data = await makeStripeRequest({
    path: 'payment-methods/detach',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function createCharge(
  projectGroupId: string,
  token: string,
  params: Stripe.ChargeCreateParams
) {
  const data = await makeStripeRequest({
    path: 'charges',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listCharges(
  projectGroupId: string,
  token: string,
  params: Stripe.ChargeListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'charges/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getCharge(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'charges/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function updateCharge(
  projectGroupId: string,
  token: string,
  id: string,
  params: Stripe.ChargeUpdateParams
) {
  const data = await makeStripeRequest({
    path: 'charges/update',
    token,
    projectGroupId,
    params: { id, ...params },
  });
  return data;
}

async function createRefund(
  projectGroupId: string,
  token: string,
  params: Stripe.RefundCreateParams
) {
  const data = await makeStripeRequest({
    path: 'refunds',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function listRefunds(
  projectGroupId: string,
  token: string,
  params: Stripe.RefundListParams = {}
) {
  const data = await makeStripeRequest({
    path: 'refunds/list',
    token,
    projectGroupId,
    params,
  });
  return data;
}

async function getRefund(projectGroupId: string, token: string, id: string) {
  const data = await makeStripeRequest({
    path: 'refunds/get',
    token,
    projectGroupId,
    params: { id },
  });
  return data;
}

async function createWebhookEndpoint(
  projectGroupId: string,
  token: string,
  params: Stripe.WebhookEndpointCreateParams
) {
  const data = await makeStripeRequest({
    path: 'webhooks',
    token,
    projectGroupId,
    params,
  });
  return data;
}

interface GetStripeParams {
  projectGroupId: string;
  token: string;
}

function getStripe({ projectGroupId, token }: GetStripeParams) {
  class StripeClient {
    checkout = {
      sessions: {
        create: (params: Stripe.Checkout.SessionCreateParams) =>
          createCheckoutSession(projectGroupId, token, params),
        list: partial(listCheckoutSessions, projectGroupId, token),
        retrieve: partial(getCheckoutSession, projectGroupId, token),
        update: partial(updateCheckoutSession, projectGroupId, token),
        expire: partial(expireCheckoutSession, projectGroupId, token),
        listLineItems: partial(listCheckoutSessionLineItems, projectGroupId, token),
      },
    };
    products = {
      create: partial(createProduct, projectGroupId, token),
      list: partial(listProducts, projectGroupId, token),
      retrieve: partial(getProduct, projectGroupId, token),
      update: partial(updateProduct, projectGroupId, token),
      del: partial(deleteProduct, projectGroupId, token),
    };
    prices = {
      create: partial(createPrice, projectGroupId, token),
      list: partial(listPrices, projectGroupId, token),
      retrieve: partial(getPrice, projectGroupId, token),
      update: partial(updatePrice, projectGroupId, token),
    };
    customers = {
      create: partial(createCustomer, projectGroupId, token),
      list: partial(listCustomers, projectGroupId, token),
      get: partial(getCustomer, projectGroupId, token),
      retrieve: partial(getCustomer, projectGroupId, token),
    };
    paymentIntents = {
      create: partial(createPaymentIntent, projectGroupId, token),
      list: partial(listPaymentIntents, projectGroupId, token),
      retrieve: partial(getPaymentIntent, projectGroupId, token),
      update: partial(updatePaymentIntent, projectGroupId, token),
      confirm: partial(confirmPaymentIntent, projectGroupId, token),
      cancel: partial(cancelPaymentIntent, projectGroupId, token),
    };
    paymentMethods = {
      create: partial(createPaymentMethod, projectGroupId, token),
      list: partial(listPaymentMethods, projectGroupId, token),
      retrieve: partial(getPaymentMethod, projectGroupId, token),
      attach: partial(attachPaymentMethod, projectGroupId, token),
      detach: partial(detachPaymentMethod, projectGroupId, token),
    };
    subscriptions = {
      create: partial(createSubscription, projectGroupId, token),
      list: partial(listSubscriptions, projectGroupId, token),
      retrieve: partial(getSubscription, projectGroupId, token),
      update: partial(updateSubscription, projectGroupId, token),
      cancel: partial(cancelSubscription, projectGroupId, token),
    };
    invoices = {
      create: partial(createInvoice, projectGroupId, token),
      list: partial(listInvoices, projectGroupId, token),
      retrieve: partial(getInvoice, projectGroupId, token),
      update: partial(updateInvoice, projectGroupId, token),
      finalizeInvoice: partial(finalizeInvoice, projectGroupId, token),
      pay: partial(payInvoice, projectGroupId, token),
      voidInvoice: partial(voidInvoice, projectGroupId, token),
    };
    charges = {
      create: partial(createCharge, projectGroupId, token),
      list: partial(listCharges, projectGroupId, token),
      retrieve: partial(getCharge, projectGroupId, token),
      update: partial(updateCharge, projectGroupId, token),
    };
    refunds = {
      create: partial(createRefund, projectGroupId, token),
      list: partial(listRefunds, projectGroupId, token),
      retrieve: partial(getRefund, projectGroupId, token),
    };
    webhookEndpoints = {
      create: partial(createWebhookEndpoint, projectGroupId, token),
    };
  }
  return StripeClient;
}
const hasEnv =
  env.CREATE_TEMP_API_KEY &&
  env.NEXT_PUBLIC_PROJECT_GROUP_ID &&
  env.NEXT_PUBLIC_CREATE_API_BASE_URL;

const stripe = hasEnv
  ? getStripe({
      projectGroupId: env.NEXT_PUBLIC_PROJECT_GROUP_ID,
      token: env.CREATE_TEMP_API_KEY,
    })
  : regularStripe;

export default stripe;
export { stripe as Stripe };
