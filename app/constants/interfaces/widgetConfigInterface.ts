
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



export interface RuleSettings {
  priceMatch?: "all" | "any"; // all = AND, any = OR
  conditions?: any; // array of conditions
}



export interface WidgetsSettings {
  heading?: string;
  subHeading?: string;
  viewType?: string;
  layoutValue?: string; // e.g. 'Layout_1' etc.
  viewCardDesign?: string;
  totalProduct?: number;
  rangeDeskProValue?: number;
  rangeTbtProValue?: number;
  rangeMbProValue?: number;
//   [key: string]: any; // additional UI settings allowed
}



export interface WidgetConfig {
//   key?: string; // optional programmatic key like 'newArrivals'
  title: string;
  active: boolean;
  no_of_products?: number;
  backend?: {
    widgetName?: string;
    widgetDescription?: string;
    // [key: string]: any;
  };
  ruleSettings?: RuleSettings; // MAY be empty or populated
  widgetsSettings?: WidgetsSettings;
  isActive?: boolean;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
  collectionId?: string; // optional associated collection ID
  [key: string]: any; // allow extra fields
}