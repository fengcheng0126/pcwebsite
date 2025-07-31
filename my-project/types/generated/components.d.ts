import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_blocks_call_to_actions';
  info: {
    displayName: 'CallToAction';
  };
  attributes: {
    description: Schema.Attribute.Text;
    Form: Schema.Attribute.Component<'elements.form', false>;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'elements.button-link', true>;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksPricing extends Struct.ComponentSchema {
  collectionName: 'components_blocks_pricings';
  info: {
    displayName: 'Pricing';
  };
  attributes: {
    description: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface BlocksRow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rows';
  info: {
    description: '';
    displayName: 'row';
  };
  attributes: {
    card: Schema.Attribute.Component<'elements.card', true>;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksTesting extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testings';
  info: {
    displayName: 'testing';
  };
  attributes: {
    testingText: Schema.Attribute.String;
  };
}

export interface ElementsButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_button_links';
  info: {
    displayName: 'ButtonLink';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
  };
}

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    description: '';
    displayName: 'card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.Decimal;
  };
}

export interface ElementsForm extends Struct.ComponentSchema {
  collectionName: 'components_elements_forms';
  info: {
    displayName: 'Form';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button-link', false>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    input: Schema.Attribute.Component<'elements.input', true>;
  };
}

export interface ElementsInput extends Struct.ComponentSchema {
  collectionName: 'components_elements_inputs';
  info: {
    displayName: 'input';
  };
  attributes: {
    inputType: Schema.Attribute.String;
    label: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
  };
}

export interface ElementsListing extends Struct.ComponentSchema {
  collectionName: 'components_elements_listings';
  info: {
    description: '';
    displayName: 'listing';
  };
  attributes: {
    listingImages: Schema.Attribute.Media<'images', true>;
    listingPrice: Schema.Attribute.String;
    listingTitle: Schema.Attribute.String;
  };
}

export interface ElementsPricingCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_pricing_cards';
  info: {
    displayName: 'Pricing Card';
  };
  attributes: {
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.Component<'elements.button-link', false>;
    planPrice: Schema.Attribute.String;
    planType: Schema.Attribute.String;
    services: Schema.Attribute.Relation<
      'oneToMany',
      'api::landing-page.landing-page'
    >;
  };
}

export interface SeoMetadata extends Struct.ComponentSchema {
  collectionName: 'components_seo_metadata';
  info: {
    displayName: 'Metadata';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.call-to-action': BlocksCallToAction;
      'blocks.hero': BlocksHero;
      'blocks.pricing': BlocksPricing;
      'blocks.row': BlocksRow;
      'blocks.testing': BlocksTesting;
      'elements.button-link': ElementsButtonLink;
      'elements.card': ElementsCard;
      'elements.form': ElementsForm;
      'elements.input': ElementsInput;
      'elements.listing': ElementsListing;
      'elements.pricing-card': ElementsPricingCard;
      'seo.metadata': SeoMetadata;
    }
  }
}
