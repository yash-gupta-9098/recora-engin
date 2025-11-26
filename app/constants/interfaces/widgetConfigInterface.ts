
export type ISODateString = string;




// export type ConditionOperator =
//   | "equals"
//   | "not_equals"
//   | "greater_than"
//   | "less_than"
//   | "in"
//   | "not_in"
//   | "contains"
//   | "not_contains";




// export interface RuleCondition {
//   /** the data field to check (e.g. 'price', 'tag', 'vendor', 'inventory.quantity', 'metafields.my_app.settings') */
//   field: string;
//   operator: ConditionOperator;
//   /** value can be string | number | boolean | array depending on operator */
//   value: string | number | boolean | Array<string | number>;
//   /** optional: human readable label or extra metadata */
//   label?: string;
//   /** optional: nested conditions for complex rules (AND/OR groups) */
//   children?: RuleCondition[]; // recursive for nested groups
// }



export interface Condition {
  id: string;
  field: string; // e.g. "product_title"
  operator: string; // e.g. "contains"
  value: string;
}

export interface RuleSettings {
  priceMatch?: "all" | "any"; // all = AND, any = OR
  conditions?: Condition[]; // array of conditions
}


export interface pageBlockSettings {
  pageActive?: boolean;
  icon?: boolean;
  [k: string]: any;
}


export interface WidgetsSettings {
  heading: string;
  subHeading: string;
  viewType: string;
  layoutValue: string; // e.g. 'Layout_1' etc.
  viewCardDesign: string;
  totalProduct: number;
  rangeDeskProValue: number;
  rangeTbtProValue: number;
  rangeMbProValue: number;
//   [key: string]: any; // additional UI settings allowed
}


export interface WidgetBackend {
  widgetName?: string;
  widgetDescription?: string;
  availableOnpages?: [{ value: string; label: string }[], string[]];
  [k: string]: any;
}



import { CommanView, ProductTitle, ProductPrice, ProductImage, ProductCard } from './globalSettingsInterface';

// Widget-specific settings (excluding colorScheme which is always global)
export interface WidgetSpecificSettings {
  commanView?: Partial<CommanView>;
  productTitle?: Partial<ProductTitle>;
  productPrice?: Partial<ProductPrice>;
  productImage?: Partial<ProductImage>;
  productCard?: Partial<ProductCard>;
  customCSS?: string;
  useGlobalSettings?: boolean; // If false, use widget-specific settings; if true/undefined, use global
}

export interface WidgetConfig {
//   key?: string; // optional programmatic key like 'newArrivals'
  title: string;
  active: boolean;
  no_of_products?: number;
  backend?: WidgetBackend;
  ruleSettings?: RuleSettings; // MAY be empty or populated
  widgetsSettings: WidgetsSettings;
  widgetSettings?: WidgetSpecificSettings; // Widget-specific overrides for global settings
  isActive?: boolean;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
   // e.g. [{home: "home"} , {collection: "collection"}, {product: "product"}, {search: "search"}, {cart: "cart"}, {blog: "blog"}, {article: "article"}, {page: "page"}]
  collectionId?: string; // optional associated collection ID
  [key: string]: any; // allow extra fields
}


export interface WidgetsPage {
  pageBlockSettings?: pageBlockSettings;
  widgets: Record<string, WidgetConfig>;
}

