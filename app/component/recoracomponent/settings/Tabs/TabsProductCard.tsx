import {
    BlockStack,
    Box,
    Text,
    Icon,
    InlineStack,
    InlineGrid,
    RangeSlider,
    Collapsible,
    Select,
    Button,
    ButtonGroup,
    Popover,
    Divider,
    ActionList,
    Tooltip,
    TextField,
} from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'app/redux/store/store';
import { updateNestedField, updateSection } from 'app/redux/slices/globalSettingsSlice';

interface ProductImageSettings {
    ratio: string;
    onHover: boolean;
    showVariantImage: boolean;
    cropImage: boolean;
    cropType: "top" | "center" | "bottom";
    padding: number;
    customClass: string;
}

interface ProductTitleSettings {
    color: string;
    showTitle: boolean;
    titleClip: boolean;
    fontSize: number;
    customClass: string;

}


interface ProductPriceSettings {
    showPrice: boolean;
    fontSize: number;
    color: string;
    comparePrice: {
        fontSize: number,
        showComparePrice: boolean;
        color: string;
    };
    variantPrice: {
        fontSize: number,
        showVariantPrice: boolean,
        color: string
    };
    // singlePriceColor: string;
    showZeroToFree: boolean;
    customClass: string;
}


interface ProductCardSettings {
    cardStyle: "standard" | "card";
    textAlignType: "left" | "center" | "right";
    colorScheme: string;
    reviewType: string;
    wishlist: string;
    showVendor: boolean;
    customClass: string;
}



interface SettingsFromDb {
    colorScheme: { [key: string]: { background: string; text: string, text_Secondary: string } };
    productTitle: ProductTitleSettings;
    productImage: ProductImageSettings;
    productPrice: ProductPriceSettings;
    productCard: ProductCardSettings;
}

interface Props {
    settingfromDb: SettingsFromDb;
    developerMode: boolean;
}

const imageRatioOptions = [
    { label: 'Square', value: '1 / 1' },
    { label: 'Portrait (2:3)', value: '2/3' },
    { label: 'Landscape (3:2)', value: '3/2' },
    { label: 'Adapt to image', value: 'auto' },
]

const wishlistItems = [
    { label: 'Wishlist Plus', value: 'wishlist_pluse' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'lastWeek' },
];

const reviewItems = [
    { label: 'Loox', value: "Loox" },
    { label: 'Okendo', value: "Okendo" },
    { label: 'Judge.me', value: "Judge_me" },
    { label: 'Stamped', value: "Stamped" },
    { label: 'Yotpo', value: "Yotpo" },
    { label: 'Ali Reviews', value: "Ali_Reviews" },
    { label: 'Rapid Reviews', value: "Rapid_Reviews" },
    { label: 'Air Reviews', value: "Air_Reviews" },
    { label: 'None', value: "none" },
];




export default function TabsProductCard({ settingfromDb, developerMode }: Props) {
    // Redux hooks
    const ReduxDispatch = useDispatch();
    const ReduxColorScheme = useSelector((state: RootState) => state.globalSettings.colorScheme);
    const ReduxProductCard = useSelector((state: RootState) => state.globalSettings.productCard);
    const ReduxProductTitle = useSelector((state: RootState) => state.globalSettings.productTitle);
    const ReduxProductPrice = useSelector((state: RootState) => state.globalSettings.productPrice);
    const ReduxProductImage = useSelector((state: RootState) => state.globalSettings.productImage);

    // console.log("settingfromDb in product card", settingfromDb);
    // const [selectedColorSchemes, setSelectedColorSchemes] = useState<any>(settingfromDb.colorScheme);

    // useEffect(() => {
    //     console.log("hello - Redux state updated")
    // }, [ReduxColorScheme, ReduxProductCard, ReduxProductTitle, ReduxProductPrice, ReduxProductImage]);

    // Collapse section control
    const [openSection, setOpenSection] = useState<string | null>("Product_card");
    const handleToggle = (section: string) =>
        setOpenSection((prev) => (prev === section ? null : section));


    // --- helper: safely read color keys (avoid crash if undefined) ---
    const scheme1Text = ReduxColorScheme?.["Scheme 1"]?.text;
    const scheme2Text = ReduxColorScheme?.["Scheme 2"]?.text;

    const {
        ProductTitleColor,
        ProductPriceColor,
        ProductComPriceColor,
        ProductVarColor,
        ProductSinglePriceColor,
    } = useMemo(() => {
        const generateOptions = (key?: string) =>
            [
                { label: "Scheme 1", value: "Scheme 1" },
                { label: "Scheme 2", value: "Scheme 2" },
            ];

        return {
            ProductTitleColor: generateOptions(),
            ProductPriceColor: generateOptions(),
            ProductComPriceColor: generateOptions(),
            ProductVarColor: generateOptions(),
            ProductSinglePriceColor: generateOptions(),
        };
    }, []);

    useEffect(() => {
        ReduxDispatch(updateSection({
            section: 'productTitle',
            payload: { color: ReduxColorScheme[ReduxProductTitle.colorScheme]?.text }
        }));

        ReduxDispatch(updateSection({ section: 'productPrice', payload: { color: ReduxColorScheme[ReduxProductPrice.colorScheme]?.text } }))

        ReduxDispatch(updateNestedField({
            path: ['productPrice', 'comparePrice', 'color'],
            value: ReduxColorScheme[ReduxProductPrice.comparePrice.colorScheme]?.text
        }))

        ReduxDispatch(updateNestedField({
            path: ['productPrice', 'variantPrice', 'color'],
            value: ReduxColorScheme[ReduxProductPrice.variantPrice.colorScheme]?.text
        }))

        ReduxDispatch(updateNestedField({
            path: ['productPrice', 'singlePrice', 'color'],
            value: ReduxColorScheme[ReduxProductPrice.singlePrice.colorScheme]?.text
        }))

    }, [scheme1Text, scheme2Text]);



    const [colorPopover, setColorPopover] = useState(false);    

    return (
        <Box
            as="ul"
            style={{ maxHeight: '600px', overflowY: 'scroll' }}
            borderStyle="solid"
        // overflowY='scroll'
        >

            {/* ProductCard */}
            <Box as="li" key={"settings_ProductCard"} borderStyle="solid" printHidden={false} visuallyHidden={false} borderBlockEndWidth='025' borderColor='border-secondary'>
                <Box as="div" padding={300} onClick={() => { handleToggle('Product_card') }} background={openSection === 'Product_card' ? "bg-fill-secondary" : "bg-fill"}>
                    <InlineStack gap="200" align="space-between" >
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight='bold'> Product Card </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon source={openSection === 'Product_card' ? ChevronUpIcon : ChevronDownIcon} tone="base" />
                        </InlineGrid>
                    </InlineStack>
                </Box>
                <Collapsible open={openSection === 'Product_card'} expandOnPrint={true} transition={true}>
                    <Box paddingBlock={400} paddingInline={300} position='relative' >
                        {/* <Box style={{ top: "-10px", position: "absolute", left: "10px", paddingInline: "10px" }} onClick={(e) => {
                            e.stopPropagation();
                            console.log("click")
                          }}><Icon source={ResetIcon} tone="magic" /></Box> */}
                        <BlockStack gap={300}>

                            {/* Card Style: Standard / Card */}
                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Style</Text>
                                <Box background="bg-fill-secondary" borderRadius="200">
                                    <ButtonGroup variant="segmented">
                                        <Button
                                            size="slim"
                                            variant={ReduxProductCard.cardStyle === "standard" ? "secondary" : "tertiary"}
                                            onClick={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { cardStyle: "standard" } }))}
                                        >
                                            Standard
                                        </Button>
                                        <Button
                                            size="slim"
                                            variant={ReduxProductCard.cardStyle === "card" ? "secondary" : "tertiary"}
                                            onClick={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { cardStyle: "card" } }))}
                                        >
                                            Card
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            </InlineStack>

                            {/* Text Alignment buttons */}
                            <InlineStack gap="100" align='space-between' blockAlign="center">
                                <Text as="p" variant="bodyMd">Alignment</Text>
                                <ButtonGroup gap="loose" variant="segmented">
                                    <Tooltip content="Text Align Left" dismissOnMouseOut>
                                        <Button
                                            size="micro"
                                            pressed={ReduxProductCard.textAlignType === "left"}
                                            onClick={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { textAlignType: "left" } }))}
                                        >
                                            <Icon source={TextAlignLeftIcon} />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Text Align Center" dismissOnMouseOut>
                                        <Button
                                            size="micro"
                                            pressed={ReduxProductCard.textAlignType === "center"}
                                            onClick={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { textAlignType: "center" } }))}
                                        >
                                            <Icon source={TextAlignCenterIcon} />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Text Align Right" dismissOnMouseOut>
                                        <Button
                                            size="micro"
                                            pressed={ReduxProductCard.textAlignType === "right"}
                                            onClick={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { textAlignType: "right" } }))}
                                        >
                                            <Icon source={TextAlignRightIcon} />
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </InlineStack>

                            {/* Show Vendor toggle */}
                            <ToggleRow
                                label="Show vendor"
                                enabled={ReduxProductCard.showVendor}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productCard', payload: { showVendor: !ReduxProductCard.showVendor } }))}
                            />

                            {/* Color Scheme Popover */}
                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Color Scheme</Text>
                                <Popover
                                    active={colorPopover}
                                    activator={
                                        <Button variant="secondary" disclosure="select" onClick={() => setColorPopover(true)}>
                                            {ReduxProductCard.colorScheme}
                                        </Button>
                                    }
                                    autofocusTarget="none"
                                    onClose={() => setColorPopover(false)}
                                >
                                    <Popover.Pane fixed>
                                        <Popover.Section>
                                            <p>Select Color Scheme</p>
                                        </Popover.Section>
                                    </Popover.Pane>
                                    <Divider />
                                    <Popover.Pane>
                                        <ActionList
                                            actionRole="menuitem"
                                            items={[
                                                { content: 'Scheme 1', active: ReduxProductCard.colorScheme == "Scheme 1", onAction: () => ReduxDispatch(updateSection({ section: 'productCard', payload: { colorScheme: "Scheme 1" } })) },
                                                { content: 'Scheme 2', active: ReduxProductCard.colorScheme == "Scheme 2", onAction: () => ReduxDispatch(updateSection({ section: 'productCard', payload: { colorScheme: "Scheme 2" } })) },
                                            ]}
                                        />
                                    </Popover.Pane>
                                </Popover>
                            </InlineStack>


                            {/* <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Card Scheme</Text>
                                <Select
                                    options={ProductCardColor}
                                    value={ReduxProductCard.colorScheme}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {colorScheme: value}})}
                                />
                            </InlineStack> */}

                            {/* Review type selection */}
                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Review</Text>
                                <Select
                                    label=""
                                    options={reviewItems}
                                    value={ReduxProductCard.reviewType}
                                    onChange={(value: string) => ReduxDispatch(updateSection({ section: 'productCard', payload: { reviewType: value } }))}
                                />
                            </InlineStack>

                            {/* Wishlist app selection */}
                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Wishlist</Text>
                                <Select
                                    label=""
                                    options={wishlistItems}
                                    value={ReduxProductCard.wishlist}
                                    onChange={(value: string) => ReduxDispatch(updateSection({ section: 'productCard', payload: { wishlist: value } }))}
                                />
                            </InlineStack>



                            {developerMode && (
                                <TextField
                                    label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Product Card Class</Text>}
                                    tone="magic"
                                    value={ReduxProductCard.customClass}
                                    onChange={(value) =>
                                        ReduxDispatch(updateSection({
                                            section: 'productCard',
                                            payload: { customClass: value },
                                        }))
                                    }
                                    autoComplete="off"
                                />
                            )}

                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>



            {/* Product Title Section */}
            <Box
                as="li"
                key="settings_Product_title"
                borderStyle="solid"
                borderBlockEndWidth="025"
                borderColor="border-secondary"
            >
                <Box
                    padding={300}
                    onClick={() => handleToggle('Product_Title')}
                    background={openSection === 'Product_Title' ? 'bg-fill-secondary' : 'bg-fill'}
                >
                    <InlineStack gap="200" align="space-between">
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight="bold">
                                Product Title
                            </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon
                                source={openSection === 'Product_Title' ? ChevronUpIcon : ChevronDownIcon}
                                tone="base"
                            />
                        </InlineGrid>
                    </InlineStack>
                </Box>

                <Collapsible open={openSection === 'Product_Title'} expandOnPrint transition>
                    <Box paddingBlock={400} paddingInline={300} position="relative">
                        <BlockStack gap={300}>
                            <ToggleRow
                                label="Show"
                                enabled={ReduxProductTitle.showTitle}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productTitle', payload: { showTitle: !ReduxProductTitle.showTitle } }))}
                            />

                            {ReduxProductTitle.showTitle && (
                                <>
                                    <InlineGrid gap="100">
                                        <Text as="p" variant="bodyMd">Font size</Text>
                                        <InlineStack gap="100" align="space-between" blockAlign="center">
                                            <RangeSlider
                                                label=""
                                                min={0.6}
                                                step={0.05}
                                                max={1.8}
                                                value={Number(ReduxProductTitle.fontSize)}
                                                onChange={(value: number) =>
                                                    ReduxDispatch(updateSection({ section: 'productTitle', payload: { fontSize: Math.min(Math.max(value, 0.6), 1.8) } }))
                                                }
                                                suffix={
                                                    <p style={{ minWidth: '24px', textAlign: 'right' }}>
                                                        <strong>{Math.floor((ReduxProductTitle.fontSize) * 20)}px</strong>
                                                    </p>
                                                }
                                            />
                                        </InlineStack>
                                    </InlineGrid>

                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Color</Text>
                                        <Select
                                            label={
                                                <Box
                                                    as="span"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        background: ReduxColorScheme[ReduxProductTitle.colorScheme]?.text,
                                                        borderRadius: '50%',
                                                        display: 'block',
                                                    }}
                                                />
                                            }
                                            labelInline
                                            options={ProductTitleColor}
                                            value={ReduxProductTitle.colorScheme}
                                            onChange={(value) => {
                                                ReduxDispatch(updateSection({ section: 'productTitle', payload: { colorScheme: value } }))
                                                ReduxDispatch(updateSection({
                                                    section: 'productTitle',
                                                    payload: { color: ReduxColorScheme[value]?.text }
                                                }))
                                            }
                                            }
                                        />
                                        <input
                                            type="hidden"
                                            name="ProductTitlecolor"
                                            value={ReduxProductTitle.colorScheme ?? ReduxColorScheme[ReduxProductTitle.colorScheme]?.text}
                                        />
                                    </InlineStack>

                                    <ToggleRow
                                        label="Enable text clipping"
                                        enabled={ReduxProductTitle.titleClip}
                                        onToggle={() => ReduxDispatch(updateSection({ section: 'productTitle', payload: { titleClip: !ReduxProductTitle.titleClip } }))}
                                        description="Restrict Titles to one line."
                                    />


                                    {developerMode && (
                                        <TextField
                                            label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">TiTle Custom Class</Text>}
                                            tone="magic"
                                            value={ReduxProductTitle.customClass}
                                            onChange={(value) =>
                                                ReduxDispatch(updateSection({
                                                    section: 'productTitle',
                                                    payload: { customClass: value },
                                                }))
                                            }
                                            autoComplete="off"
                                        />
                                    )}
                                </>

                            )
                            }

                        </BlockStack>
                    </Box>
                </Collapsible>

            </Box>

            {/* Product Price  */}
            <Box as="li" key={"settings_Price"} borderStyle="solid" printHidden={false} visuallyHidden={false} borderBlockEndWidth='025' borderColor='border-secondary'>
                <Box as="div" padding={300} onClick={() => { handleToggle('Product_Price') }} background={openSection === 'Product_Price' ? "bg-fill-secondary" : "bg-fill"}>
                    <InlineStack gap="200" align="space-between" >
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight='bold'> Product Price </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon source={openSection === 'Product_Price' ? ChevronUpIcon : ChevronDownIcon} tone="base" />
                        </InlineGrid>
                    </InlineStack>
                </Box>
                <Collapsible open={openSection === 'Product_Price'} expandOnPrint={true} transition={true}>
                    <Box paddingBlock={400} paddingInline={300} position='relative' >
                        <BlockStack gap={300}>
                            <ToggleRow
                                label="Show"
                                enabled={ReduxProductPrice.showPrice}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productPrice', payload: { showPrice: !ReduxProductPrice.showPrice } }))}
                            />


                            {ReduxProductPrice.showPrice && (
                                <>
                                    {/* Price color selection */}
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Price</Text>
                                        <Select
                                            label={
                                                <Box
                                                    as="span"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        background: ReduxColorScheme[ReduxProductPrice.colorScheme]?.text,
                                                        borderRadius: '50%',
                                                        display: 'block',
                                                    }}
                                                />
                                            }
                                            labelInline
                                            options={ProductPriceColor}
                                            value={ReduxProductPrice.colorScheme}
                                            onChange={(value) => {
                                                ReduxDispatch(updateSection({ section: 'productPrice', payload: { colorScheme: value } }))
                                                ReduxDispatch(updateSection({ section: 'productPrice', payload: { color: ReduxColorScheme[value]?.text } }))
                                            }}
                                        />
                                        <input
                                            type="hidden"
                                            name="ProductPriceColor"
                                            value={ReduxProductPrice.colorScheme ?? ReduxColorScheme[ReduxProductPrice.colorScheme]?.text}
                                        />
                                    </InlineStack>

                                    {/* Font size for price */}
                                    <InlineGrid gap="100">
                                        <Text as="p" variant="bodyMd">Font size</Text>
                                        <InlineStack gap="100" align="space-between" blockAlign="center">
                                            <RangeSlider
                                                label=""
                                                min={1}
                                                step={0.05}
                                                max={3}
                                                value={Number(ReduxProductPrice.fontSize)}
                                                onChange={(value: number) =>
                                                    ReduxDispatch(updateSection({ section: 'productPrice', payload: { fontSize: Math.min(Math.max(value, 1), 3) } }))
                                                }
                                                suffix={
                                                    <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                        <strong>{Math.floor(ReduxProductPrice.fontSize * 10)}px</strong>
                                                    </p>
                                                }
                                            />
                                        </InlineStack>
                                    </InlineGrid>


                                    {developerMode && (
                                        <TextField
                                            label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Price Custom Class</Text>}
                                            tone="magic"
                                            value={ReduxProductPrice.customClass}
                                            onChange={(value) =>
                                                ReduxDispatch(updateSection({
                                                    section: 'productPrice',
                                                    payload: { customClass: value },
                                                }))
                                            }
                                            autoComplete="off"
                                        />
                                    )}

                                    {(ReduxProductPrice.comparePrice.showComparePrice || ReduxProductPrice.showPrice) && (

                                        <Divider />
                                    )}


                                    {/* Toggle for compare price display */}
                                    <ToggleRow
                                        label="Compare Price"
                                        enabled={ReduxProductPrice.comparePrice.showComparePrice}
                                        // onToggle={() => ReduxDispatch(updateSection({section: 'productPrice', payload: {comparePrice: {showComparePrice: !ReduxProductPrice.comparePrice.showComparePrice}}}))}
                                        onToggle={() =>
                                            ReduxDispatch(updateNestedField({
                                                path: ['productPrice', 'comparePrice', 'showComparePrice'],
                                                value: !ReduxProductPrice.comparePrice.showComparePrice
                                            }))
                                        }
                                    />

                                    {ReduxProductPrice.comparePrice.showComparePrice && (<>

                                        {/* Compare price color selection */}
                                        <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                            <Text as="p" variant="bodyMd">Color</Text>
                                            <Select
                                                options={ProductComPriceColor}
                                                labelInline
                                                label={
                                                    <Box
                                                        as="span"
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            background: ReduxColorScheme[ReduxProductPrice.comparePrice.colorScheme]?.text,
                                                            borderRadius: '50%',
                                                            display: 'block',
                                                        }}
                                                    />
                                                }
                                                value={ReduxProductPrice.comparePrice.colorScheme}
                                                // onChange={(value) => ReduxDispatch(updateSection({section: 'productPrice', payload: {comparePrice: {color: value}}}))}
                                                onChange={(value) => {
                                                    ReduxDispatch(updateNestedField({
                                                        path: ['productPrice', 'comparePrice', 'colorScheme'],
                                                        value: value
                                                    }))

                                                    ReduxDispatch(updateNestedField({
                                                        path: ['productPrice', 'comparePrice', 'color'],
                                                        value: ReduxColorScheme[value]?.text
                                                    }))
                                                }
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="ProductComparePriceColor"
                                                value={ReduxProductPrice.comparePrice.colorScheme ?? ReduxColorScheme[ReduxProductPrice.comparePrice.colorScheme]?.text}
                                            />
                                        </InlineStack>

                                        <InlineGrid gap="100">
                                            <Text as="p" variant="bodyMd">Font size</Text>
                                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                                <RangeSlider
                                                    label=""
                                                    min={1}
                                                    step={0.05}
                                                    max={3}
                                                    value={Number(ReduxProductPrice.comparePrice.fontSize)}
                                                    // onChange={(value : number) => 
                                                    //     ReduxDispatch(updateSection({section: 'productPrice', payload: {comparePrice: {fontSize: Math.min(Math.max(value, 1), 3)}}}))
                                                    // }
                                                    onChange={(value: number) =>
                                                        ReduxDispatch(updateNestedField({
                                                            path: ['productPrice', 'comparePrice', 'fontSize'],
                                                            value: Math.min(Math.max(value, 1), 3)
                                                        }))
                                                    }
                                                    suffix={
                                                        <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                            <strong>{Math.floor(ReduxProductPrice.comparePrice.fontSize * 10)}px</strong>
                                                        </p>
                                                    }
                                                />
                                            </InlineStack>
                                        </InlineGrid>

                                    </>)}




                                    {(ReduxProductPrice.variantPrice.showVariantPrice || ReduxProductPrice.comparePrice.showComparePrice) && (

                                        <Divider />
                                    )}


                                    <ToggleRow
                                        label="Variant Price"
                                        enabled={ReduxProductPrice.variantPrice.showVariantPrice}
                                        // onToggle={() => ReduxDispatch(updateSection({section: 'productPrice', payload: {variantPrice: {showVariantPrice: !ReduxProductPrice.variantPrice.showVariantPrice}}}))}
                                        onToggle={() =>
                                            ReduxDispatch(updateNestedField({
                                                path: ['productPrice', 'variantPrice', 'showVariantPrice'],
                                                value: !ReduxProductPrice.variantPrice.showVariantPrice
                                            }))

                                        }
                                    />


                                    {ReduxProductPrice.variantPrice.showVariantPrice && (
                                        <>
                                            <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                                <Text as="p" variant="bodyMd">Color</Text>
                                                <Select
                                                    options={ProductVarColor}
                                                    labelInline
                                                    label={
                                                        <Box
                                                            as="span"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                background: ReduxColorScheme[ReduxProductPrice.variantPrice.colorScheme]?.text,
                                                                borderRadius: '50%',
                                                                display: 'block',
                                                            }}
                                                        />
                                                    }
                                                    value={ReduxProductPrice.variantPrice.colorScheme}
                                                    // onChange={(value) => ReduxDispatch(updateSection({section: 'productPrice', payload: {variantPrice: {color: value}}}))}
                                                    onChange={(value) => {
                                                        ReduxDispatch(updateNestedField({
                                                            path: ['productPrice', 'variantPrice', 'colorScheme'],
                                                            value: value
                                                        }))
                                                        ReduxDispatch(updateNestedField({
                                                            path: ['productPrice', 'variantPrice', 'color'],
                                                            value: ReduxColorScheme[value]?.text
                                                        }))

                                                    }
                                                    }
                                                />

                                                <input
                                                    type="hidden"
                                                    name="ProductTitlecolor"
                                                    value={ReduxProductPrice.variantPrice.colorScheme ?? ReduxColorScheme[ReduxProductPrice.variantPrice.colorScheme]?.text}
                                                />
                                            </InlineStack>

                                            <InlineGrid gap="100">
                                                <Text as="p" variant="bodyMd">Font size</Text>
                                                <InlineStack gap="100" align="space-between" blockAlign="center">
                                                    <RangeSlider
                                                        label=""
                                                        min={1}
                                                        step={0.05}
                                                        max={3.8}
                                                        value={Number(ReduxProductPrice.variantPrice.fontSize)}
                                                        // onChange={(value : number) => 
                                                        //     ReduxDispatch(updateSection({section: 'productPrice', payload: {variantPrice: {fontSize: Math.min(Math.max(value, 1), 3.8)}}}))
                                                        // }
                                                        onChange={(value: number) =>
                                                            ReduxDispatch(updateNestedField({
                                                                path: ['productPrice', 'variantPrice', 'fontSize'],
                                                                value: Math.min(Math.max(value, 1), 3.8)
                                                            }))
                                                        }
                                                        suffix={
                                                            <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                                <strong>{Math.floor(ReduxProductPrice.variantPrice.fontSize * 10)}px</strong>
                                                            </p>
                                                        }
                                                    />
                                                </InlineStack>
                                            </InlineGrid>

                                        </>
                                    )}


                                    {ReduxProductPrice.variantPrice.showVariantPrice && (

                                        <Divider />
                                    )}


                                    <ToggleRow
                                        label="Variant Price"
                                        enabled={ReduxProductPrice.singlePrice.applySinglePrice}
                                        onToggle={() =>
                                            ReduxDispatch(updateNestedField({
                                                path: ['productPrice', 'singlePrice', 'applySinglePrice'],
                                                value: !ReduxProductPrice.singlePrice.applySinglePrice
                                            }))
                                        }
                                    />


                                    {ReduxProductPrice.singlePrice.applySinglePrice && (
                                        <>
                                            <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                                <Text as="p" variant="bodyMd">Color</Text>
                                                <Select
                                                    options={ProductSinglePriceColor}
                                                    labelInline
                                                    label={
                                                        <Box
                                                            as="span"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                background: ReduxColorScheme[ReduxProductPrice.singlePrice.colorScheme]?.text,
                                                                borderRadius: '50%',
                                                                display: 'block',
                                                            }}
                                                        />
                                                    }
                                                    value={ReduxProductPrice.singlePrice.colorScheme}
                                                    // onChange={(value) => ReduxDispatch(updateSection({section: 'productPrice', payload: {singlePrice: {color: value}}}))}
                                                    onChange={(value) => {
                                                        ReduxDispatch(updateNestedField({
                                                            path: ['productPrice', 'singlePrice', 'colorScheme'],
                                                            value: value
                                                        }))


                                                        ReduxDispatch(updateNestedField({
                                                            path: ['productPrice', 'singlePrice', 'color'],
                                                            value: ReduxColorScheme[value]?.text
                                                        }))

                                                    }
                                                    }
                                                />

                                                <input
                                                    type="hidden"
                                                    name="ProductTitlecolor"
                                                    value={ReduxProductPrice.singlePrice.colorScheme ?? ReduxColorScheme[ReduxProductPrice.singlePrice.colorScheme]?.text}
                                                />
                                            </InlineStack>

                                        </>
                                    )}


                                    {ReduxProductPrice.singlePrice.applySinglePrice && (

                                        <Divider />
                                    )}



                                    {/* Toggle for zero-to-free conversion */}
                                    <ToggleRow
                                        label="Zero price as free"
                                        enabled={ReduxProductPrice.showZeroToFree}
                                        onToggle={() => ReduxDispatch(updateSection({ section: 'productPrice', payload: { showZeroToFree: !ReduxProductPrice.showZeroToFree } }))}
                                    />


                                </>
                            )}
                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>



            {/* Product Image Section */}
            <Box
                as="li"
                borderStyle="solid"
                borderBlockEndWidth="025"
                borderColor="border-secondary"
            >
                <Box
                    padding={300}
                    onClick={() => handleToggle('Product_Image')}
                    background={
                        openSection === 'Product_Image' ? 'bg-fill-secondary' : 'bg-fill'
                    }
                >
                    <InlineStack gap="200" align="space-between">
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight="bold">
                                Product Image
                            </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon
                                source={
                                    openSection === 'Product_Image'
                                        ? ChevronUpIcon
                                        : ChevronDownIcon
                                }
                                tone="base"
                            />
                        </InlineGrid>
                    </InlineStack>
                </Box>

                <Collapsible
                    open={openSection === 'Product_Image'}
                    transition
                    expandOnPrint
                >
                    <Box paddingBlock={400} paddingInline={300} position="relative">
                        <BlockStack gap={300}>
                            <InlineStack gap={100} align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">
                                    Image Ratio
                                </Text>
                                <Select
                                    options={imageRatioOptions}
                                    value={ReduxProductImage.ratio}
                                    onChange={(value) => ReduxDispatch(updateSection({ section: 'productImage', payload: { ratio: value } }))}
                                />
                            </InlineStack>

                            {/* Second image on hover */}
                            <ToggleRow
                                label="Second image on hover"
                                enabled={ReduxProductImage.onHover}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productImage', payload: { onHover: !ReduxProductImage.onHover } }))}
                            />

                            {/* Show variant image */}
                            <ToggleRow
                                label="Show Variant Image"
                                enabled={ReduxProductImage.showVariantImage}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productImage', payload: { showVariantImage: !ReduxProductImage.showVariantImage } }))}
                            />

                            {/* Crop image toggle */}
                            <ToggleRow
                                label="Crop media to fit"
                                enabled={ReduxProductImage.cropImage}
                                onToggle={() => ReduxDispatch(updateSection({ section: 'productImage', payload: { cropImage: !ReduxProductImage.cropImage } }))}
                            />

                            {/* Crop position */}
                            <InlineGrid gap={100}>
                                <Text as="p" variant="bodyMd">
                                    Crop position
                                </Text>
                                <ButtonGroup gap="loose" variant="segmented">
                                    {['top', 'center', 'bottom'].map((pos) => (
                                        <Button
                                            key={pos}
                                            size="slim"
                                            pressed={ReduxProductImage.cropType == pos}
                                            onClick={() =>
                                                ReduxDispatch(updateSection({ section: 'productImage', payload: { cropType: pos } }))}
                                        >
                                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </InlineGrid>

                            {/* Padding */}
                            <InlineGrid gap={100}>
                                <Text as="p" variant="bodyMd">
                                    Padding around Image
                                </Text>
                                <InlineStack
                                    gap={100}
                                    align="space-between"
                                    blockAlign="center"
                                >
                                    <RangeSlider
                                        label=" "
                                        min={0}
                                        step={1}
                                        max={25}
                                        value={ReduxProductImage.padding}
                                        onChange={(value) => ReduxDispatch(updateSection({ section: 'productImage', payload: { padding: value } }))}
                                        suffix={
                                            <p style={{ minWidth: '24px', textAlign: 'right' }}>
                                                <strong>
                                                    {Math.floor((ReduxProductImage.padding))}px
                                                </strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>


                            {developerMode && (
                                <TextField
                                    label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Image Custom Class</Text>}
                                    tone="magic"
                                    value={ReduxProductImage.customClass}
                                    onChange={(value) =>
                                        ReduxDispatch(updateSection({
                                            section: 'productImage',
                                            payload: { customClass: value },
                                        }))
                                    }
                                    autoComplete="off"
                                />
                            )}

                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>



        </Box >
    );
}

// Reusable toggle switch UI
function ToggleRow({
    label,
    enabled,
    onToggle,
}: {
    label: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <InlineStack gap={100} align="space-between" blockAlign="center">
            <Text as="p" variant="bodyMd">
                {label}
            </Text>
            <Box
                style={{
                    width: '36px',
                    height: '20px',
                    position: 'relative',
                    borderRadius: 'var(--p-border-radius-100)',
                    background: enabled
                        ? 'var(--p-color-bg-inverse)'
                        : 'var(--p-color-icon-secondary)',
                }}
                padding={400}
                borderRadius="200"
                onClick={onToggle}
            >
                <Box
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--p-border-radius-050)',
                        background: 'var(--p-color-bg-surface)',
                        position: 'absolute',
                        top: '50%',
                        transform: enabled
                            ? 'translate(18px , -50%)'
                            : 'translate(5px , -50%)',
                        transition: 'transform var(--p-motion-duration-50) var(--p-motion-ease)',
                    }}
                />
            </Box>
        </InlineStack>
    );

}