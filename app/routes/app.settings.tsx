import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Divider,
  Tooltip,
  Tabs,
} from "@shopify/polaris";
import {
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import { Form, useLoaderData } from "@remix-run/react";
import TabsLayout from "app/component/recoracomponent/settings/Tabs/TabsLayout";
import TabsProductCard from "app/component/recoracomponent/settings/Tabs/TabsProductCard";
import TabsColor from "app/component/recoracomponent/settings/Tabs/TabsColor";
import { authenticate } from "../shopify.server";
import { getShopSettings } from "db/getShopSettings";
import { updateShopSettings } from "db/updateShopSettings";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import RecoraDiv from "app/component/recoracomponent/RecoraDiv";
import DesktopPreview from "app/component/recoracomponent/PreviewRight/DesktopPreview";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalSettings } from "app/redux/slices/globalSettingsSlice";
import { RootState } from "app/redux/store/store";

// TypeScript interfaces for better type safety
interface ColorSchemeData {
  [key: string]: {
    text: string;
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

interface LayoutSettings {
  layoutValue: string;
  totalProduct: number;
  desktop: {
    viewType: string;
    rangeProValue: number;
  };
  tablet: {
    viewType: string;
    rangeProValue: number;
  };
  mobile: {
    viewType: string;
    rangeProValue: number;
  };
}

interface ProductTitleSettings {
  showTitle: boolean;
  titleClip: boolean;
  color: string;
  fontSize: number;
}

interface ProductPriceSettings {
  showPrice: boolean;
  color: string;
  fontSize: number;
  comparePrice: {
    showComparePrice: boolean;
    color: string;
    fontSize: number;
  };
  showZeroToFree: boolean;
}

interface ProductImageSettings {
  ratio: string;
  onHover: boolean;
  showVariantImage: boolean;
  cropImage: boolean;
  cropType: "top" | "center" | "bottom";
  padding: number;
}

interface ProductCardSettings {
  cardStyle: string;
  reviewType: string;
  wishlist: string;
  colorScheme: string;
  showVendor: boolean;
  textAlignType: "left" | "center" | "right";
}

interface SettingsPayload {
  commanView: LayoutSettings;
  productTitle: ProductTitleSettings;
  productPrice: ProductPriceSettings;
  productImage: ProductImageSettings;
  productCard: ProductCardSettings;
  customCSS: string;
  colorScheme: ColorSchemeData;
}

type LoaderData = {
  developerMode: boolean;
  products: any[];
  settings: Record<string, any>;
};


// tab Code
const tabs = [
  {
    id: "repeat-customers-4",
    content: "Color",
    panelID: "repeat-customers-content-4",
  },
  {
    id: "accepts-marketing-4",
    content: "Product Card",
    accessibilityLabel: "Layout",
    panelID: "accepts-marketing-content-4",
  },
  {
    id: "all-customers-4",
    content: "Layout",
    accessibilityLabel: "Layout",
    panelID: "all-customers-content-4",
  },
];



export const query = `
query Products($first: Int) {
     products(first: $first) {
    edges {
      node {
        id
        title
        vendor
        status
        variants(first: 5) {
          nodes {
            price
            displayName
            contextualPricing(context: {}) {
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
            }
            image {
              url(transform: {crop: CENTER})
            }
          }
        }
        media(first: 2) {
          nodes {
            preview {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}
`;

// Static action handler for form submission
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const payload = formData.get("payload") as string;
  // console.log(payload, "payload from action");

  const globalSetting = {
    globalSettings: JSON.parse(payload),
  };
  const updateSettings = await updateShopSettings(request, globalSetting);

  // For now, just return success
  return { success: true };
};

// Static loader that returns static data
export const loader = async ({ request }: { request: Request }) => {

  const { session, admin } = await authenticate.admin(request);
  const defaultSettings = await getShopSettings(session.shop);
  const url = new URL(request.url);
  const isDeveloper = url.searchParams.get("r3c0r@") === "true";

  const response = await admin.graphql(query, { variables: { first: 10 } });
  const products = await response.json();


  // #up: settings  ki  bhejne  vali  value ko change karna  h correct way m  y  settings.value.payload  m nhi bhejna  h 

  return {
    developerMode: isDeveloper,
    products: products.data.products.edges,
    settings: { value: { payload: JSON.stringify(defaultSettings) } },
  };
};




export default function AdditionalPage() {

  const shopify = useAppBridge();
  const reduxDispatch = useDispatch();
 const globalSettings = useSelector((state: RootState) => state.globalSettings);

const initialSettingsRef = useRef<any | null>(null);

const saveBarTimerRef = useRef<number | null>(null);






 

  const handleSave = () => {
    document.querySelector("form")?.requestSubmit();
    shopify.toast.show('Seetings Save');
    shopify.saveBar.hide('global-settings');
  };

  const handleDiscard = () => {
    console.log('Discarding');
    // shopify.toast.show('Seetings Discard');
    shopify.saveBar.hide('global-settings');

  };

  // tab Variables
  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  }, []);

  const { developerMode, products, settings } = useLoaderData<LoaderData>();


useEffect(() => {
    if (settings && !initialSettingsRef.current) {
      // loader returns settings.value.payload stringified - adjust if different
      const settingFromDb = JSON.parse(settings.value.payload);
      initialSettingsRef.current = settingFromDb.globalSettings ?? settingFromDb;
      // set initial into redux (you already do this)
      reduxDispatch(setGlobalSettings(initialSettingsRef.current));
    }
  }, [settings, reduxDispatch]);





   useEffect(() => {
    // if we don't yet have initial value, do nothing
    if (!initialSettingsRef.current) return;

    // compare (simple method)
    const a = JSON.stringify(initialSettingsRef.current);
    const b = JSON.stringify(globalSettings);

    // debounce small delay to avoid flicker on many updates
    if (saveBarTimerRef.current) {
      window.clearTimeout(saveBarTimerRef.current);
    }
    saveBarTimerRef.current = window.setTimeout(() => {
      if (a !== b) {
        // settings changed -> show SaveBar
        try {
          // shopify.saveBar.show?.('global-settings');
        } catch (err) {
          console.warn("SaveBar show error", err);
        }
      } else {
        // settings same as initial -> hide SaveBar
        try {
          // shopify.saveBar.hide?.('global-settings');
        } catch (err) {
          console.warn("SaveBar hide error", err);
        }
      }
    }, 200); // 200ms debounce; change if needed

    // cleanup not strictly necessary here
    return () => {
      if (saveBarTimerRef.current) {
        window.clearTimeout(saveBarTimerRef.current);
      }
    };
  }, [globalSettings]);



 
  console.log(globalSettings , "globalSettings 5555555555555");


 



  const [previewStyle, setPreviewStyle] = useState("desktop");
  const [disableDesktop, setDisableDesktop] = useState(false);
  const [disableTablet, setDisableTablet] = useState(false);


  useEffect(() => {
    const handleResize = () => {

      if (window.innerWidth >= 768) {
        setDisableDesktop(false)
        setDisableTablet(false)
        setPreviewStyle("desktop")
      }
      else if (window.innerWidth < 768 && window.innerWidth > 549) {
        setDisableDesktop(true)
        setPreviewStyle("tablet")
      }
      else {
        setDisableDesktop(true)
        setDisableTablet(true)
        setPreviewStyle("mobile")
      }
    };

    handleResize(); // initial check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // preview  tabs

  const handlePreviewStyle = useCallback((value: string) => {
    setPreviewStyle(value);
  }, []);

  return (
    <Form method="post">
      <RecoraDiv style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <Page
          fullWidth={true}
          title="Settings"
        >
           {/* <SaveBar
            id="global-settings"
          >
            <button variant="primary" onClick={handleSave}></button>
            <button onClick={handleDiscard}></button>
          </SaveBar>   */}
          <Layout sectioned={false}>
            <Layout.Section>
              <Card background="bg-surface" padding="0" roundedAbove="sm">
                <Box
                  as="div"
                  borderStyle="solid"
                  padding="400"
                  paddingInline="400"
                  printHidden={false}
                  visuallyHidden={false}
                >
                  <InlineGrid
                    columns={{ xs: 1, sm: 1, lg: 2, xl: 2, md: 2 }}
                    alignItems="center"
                  >
                    {tabs &&
                      <Tabs
                        tabs={tabs}
                        selected={selected}
                        onSelect={handleTabChange}
                        disclosureText="More views"
                      />
                    }
                    <InlineStack wrap={true} gap="100" align="end">
                      <ButtonGroup
                        variant="segmented"
                        fullWidth={false}
                        connectedTop={false}
                        noWrap={false}
                      >
                        <Tooltip content="Desktop View" dismissOnMouseOut>
                          <Button
                            disabled={disableDesktop}
                            size="large"
                            pressed={previewStyle === "desktop"}
                            onClick={() => {
                              handlePreviewStyle("desktop");
                            }}
                            icon={DesktopIcon}
                          >
                          </Button>
                        </Tooltip>
                        <Tooltip content="Tablet View" dismissOnMouseOut>
                          <Button
                            disabled={disableTablet}
                            size="large"
                            pressed={previewStyle === "tablet"}
                            onClick={() => {
                              handlePreviewStyle("tablet");
                            }}
                            icon={TabletIcon}
                          >
                            {/* <Icon source={TabletIcon}></Icon> */}
                          </Button>
                        </Tooltip>
                        <Tooltip content="Mobile View" dismissOnMouseOut>
                          <Button
                            size="large"
                            pressed={previewStyle === "mobile"}
                            onClick={() => {
                              handlePreviewStyle("mobile");
                            }}
                            icon={MobileIcon}
                          >
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </InlineStack>
                  </InlineGrid>
                </Box>
                <Divider borderColor="border-secondary" borderWidth="025" />
                <Box as="div" borderStyle="solid" paddingBlockEnd="400">
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 3, xl: 3 }}>
                      {/* <Scrollable  style={{ height: '70vh' }} > */}
                      <div style={{ display: selected === 0 ? 'block' : 'none' }}>
                        <TabsColor
                        />
                      </div>
                      <div style={{ display: selected === 1 ? 'block' : 'none' }}>
                        <TabsProductCard
                          settingfromDb={globalSettings}
                          developerMode={developerMode}
                        />
                      </div>
                      <div style={{ display: selected === 2 ? 'block' : 'none' }}>
                        <TabsLayout
                          settingfromDb={globalSettings}
                          developerMode={developerMode}
                        />
                      </div>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 9, xl: 9 }}>
                      <Box padding={"300"}>
                        {/* {previewStyle === "desktop" &&  */}
                        <DesktopPreview products={products} previewStyle={previewStyle} payload={globalSettings} />
                        {/* } */}
                      </Box>
                    </Grid.Cell>
                    <input
                      type="hidden"
                      name="payload"
                      value={JSON.stringify(globalSettings)}
                    />
                  </Grid>
                </Box>
              </Card>
            </Layout.Section>
            <Layout.Section />
          </Layout>
        </Page>
      </RecoraDiv>
    </Form>
  );
}
