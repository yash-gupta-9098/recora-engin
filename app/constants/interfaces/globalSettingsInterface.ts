// app/types/GlobalSettings.ts

export interface FontSetting {
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right";
  customClass: string;
}

export interface ViewSetting {
  screenSize: string;
  viewType: "grid" | "slider";
  rangeProValue: number;
}

export interface CommanView {
  customClass: string;
  layoutValue: string;
  totalProduct: number;
  heading: FontSetting;
  subHeading: FontSetting;
  desktop: ViewSetting;
  tablet: ViewSetting;
  mobile: ViewSetting;
}

export interface ProductTitle {
  showTitle: boolean;
  titleClip: boolean;
  color: string;
  colorScheme: string;
  fontSize: number;
  customClass: string;
}

export interface ProductPrice {
  showPrice: boolean;
  color: string;
  colorScheme: string;
  fontSize: number;
  comparePrice: {
    fontSize: number;
    showComparePrice: boolean;
    color: string;
    colorScheme: string;
  };
  variantPrice: {
    fontSize: number;
    showVariantPrice: boolean;
    color: string;
    colorScheme: string;
  };
  singlePrice: {
  applySinglePrice: boolean;
   color: string;
   colorScheme: string;
  }
  showZeroToFree: boolean;
  customClass: string;
}

export interface ProductImage {
  ratio: string;
  onHover: boolean;
  showVariantImage: boolean;
  cropImage: boolean;
  cropType: "top" | "center" | "bottom";
  padding: number;
  customClass: string;
}

export interface ProductCard {
  cardStyle: "standard" | "card";
  reviewType: string;
  wishlist: string;
  colorScheme: string;
  showVendor: boolean;
  textAlignType: "left" | "center" | "right";
  customClass: string;
}

export interface ColorScheme {
  [key: string]: {
    text: string;
    border: string;
    text_Secondary: string;
    background: string;
    card_border: string;
    button_background: string;
    button_text: string;
    button_outline: string;
    button_hover_background: string;
    button_hovertext: string;
    button_hover_outline: string;
    icon_color: string;
    icon_hover_color: string;
    icon_background: string;
    icon_hover_background: string;
  };
}

export interface GlobalSettingsState {
  commanView: CommanView;
  productTitle: ProductTitle;
  productPrice: ProductPrice;
  productImage: ProductImage;
  productCard: ProductCard;
  customCSS: string;
  colorScheme: ColorScheme;
}
