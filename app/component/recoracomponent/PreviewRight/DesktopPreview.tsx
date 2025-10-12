import { Button, Icon, Text } from "@shopify/polaris";
import React, { useMemo, useState, useEffect } from "react";
import "./CSS/DesktopPreview.css";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store/store';
import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  MenuIcon
} from '@shopify/polaris-icons';

import Landscape from "../../../utils/Landscape"
interface DesktopPreviewProps {
  products: any[];
  previewStyle: string;
  payload: Record<string, any>;
}

export function DesktopPreview({
  products,
  previewStyle,
  payload,
}: DesktopPreviewProps) {
  // console.log(payload, "payload desktop");

  // Redux state
  const ReduxColorScheme = useSelector((state: RootState) => state.globalSettings.colorScheme);
  const ReduxCommanView = useSelector((state: RootState) => state.globalSettings.commanView);
  const ReduxProductCard = useSelector((state: RootState) => state.globalSettings.productCard);
  const ReduxProductTitle = useSelector((state: RootState) => state.globalSettings.productTitle);
  const ReduxProductPrice = useSelector((state: RootState) => state.globalSettings.productPrice);
  const ReduxProductImage = useSelector((state: RootState) => state.globalSettings.productImage);

  const [ landscape ,  setLandscape] = useState(false)


  const rootCSS = {
    "--rcr_card_textAlignType": ReduxProductCard.textAlignType || payload.productCard.textAlignType,
    "--rcr_product_per_Dekview": ReduxCommanView.desktop.rangeProValue || payload.commanView.desktop.rangeProValue,
    "--rcr_product_per_Mobview": ReduxCommanView.mobile.rangeProValue || payload.commanView.mobile.rangeProValue,
    "--rcr_product_per_Tabview": ReduxCommanView.tablet.rangeProValue || payload.commanView.tablet.rangeProValue,
    "--rcr_product_image_size": ReduxProductImage.ratio || payload.productImage.ratio,
    "--rcr_product_image_padding": `${ReduxProductImage.padding || payload.productImage.padding}px`,
    "--rcr_heading_textAlignType": ReduxCommanView.heading.textAlign || payload.commanView.heading.textAlign,
    "--rcr_heading_size": `${ReduxCommanView.heading.fontSize || payload.commanView.heading.fontSize}`,
    "--rcr_heading_color": ReduxCommanView.heading.color || payload.commanView.heading.color,
    "--rcr_subHeading_textAlignType": ReduxCommanView.subHeading.textAlign || payload.commanView.subHeading.textAlign,
    "--rcr_subHeading_size": `${ReduxCommanView.subHeading.fontSize || payload.commanView.subHeading.fontSize}`,
    "--rcr_subHeading_color": ReduxCommanView.subHeading.color || payload.commanView.subHeading.color,
    "--rcr_product_title_size": `${ReduxProductTitle.fontSize || payload.productTitle.fontSize}`,
    "--rcr_product_title_color": ReduxProductTitle.color || payload.productTitle.color,
    "--rcr_product_price_size": `${ReduxProductPrice.fontSize || payload.productPrice.fontSize}`,
    "--rcr_product_price_color": ReduxProductPrice.color || payload.productPrice.color,
    "--rcr_product_com_price_color": ReduxProductPrice.comparePrice.color || payload.productPrice.comparePrice.color,
    "--rcr_product_com_price_size": `${ReduxProductPrice.comparePrice.fontSize || payload.productPrice.comparePrice.fontSize}`,
    // Color scheme CSS variables
    "--rcr_scheme1_text": ReduxColorScheme["Scheme 1"]?.text || payload.colorScheme?.["Scheme 1"]?.text,
    "--rcr_scheme1_background": ReduxColorScheme["Scheme 1"]?.background || payload.colorScheme?.["Scheme 1"]?.background,
    "--rcr_scheme1_border": ReduxColorScheme["Scheme 1"]?.card_border || payload.colorScheme?.["Scheme 1"]?.card_border,
    "--rcr_scheme2_text": ReduxColorScheme["Scheme 2"]?.text || payload.colorScheme?.["Scheme 2"]?.text,
    "--rcr_scheme2_background": ReduxColorScheme["Scheme 2"]?.background || payload.colorScheme?.["Scheme 2"]?.background,
    "--rcr_scheme2_border": ReduxColorScheme["Scheme 2"]?.card_border || payload.colorScheme?.["Scheme 2"]?.card_border,
  }
    
  
  




  useEffect(() => {
    console.log("DesktopPreview - Redux state updated")
    console.log("ReduxColorScheme:", ReduxColorScheme)
    
  }, [ReduxColorScheme, ReduxCommanView, ReduxProductCard, ReduxProductTitle, ReduxProductPrice, ReduxProductImage]);



function toggleOrientation() {
 setLandscape(prev => !prev)
}






  const uniqueKey = uuidv4();


return (
    <>
<div className={`${previewStyle}-frame ${landscape ? "landscape" : "vertical"}`}>
  <div className={`${previewStyle}-header`}>
     <img width="100px" src="https://cdn.prod.website-files.com/61f440a1f86f74c9d0007b4c/61f89c0e14ac27c05da734c6_recora-logo.svg"/>
     
     <Button variant="plain" icon={MenuIcon}/>

     {previewStyle =="desktop" && (
      <>
      <ul className="rec-desktop-menu">
        <li className="rec-desktop-item">Home</li>
        <li className="rec-desktop-item">About</li>
        <li className="rec-desktop-item">Contact</li>
      </ul>
      </>
     ) }

  </div>
  <div className={`${previewStyle}-notch`}></div>
  <div className={`${previewStyle}-screen screen_layout `} style={rootCSS}>

    <h2 className="rcr_wgt_heading">You May Also Like</h2>
    <h2 className="rcr_wgt_subHeading">Puruce  now  30 % of</h2>
    <ul
      className={`recoraRightPreview recora_preview_${previewStyle} recora_layoutValue_${ReduxCommanView[previewStyle]?.viewType || payload.commanView[previewStyle].viewType}`}
      
    >
      {products.slice(0,6).map((item) => {
        const { id, title, media, variants, vendor } = item.node;
        return (
          <li key={id} className={`recora_Card recr_style_${ReduxProductCard.cardStyle || payload.productCard.cardStyle}`}>
            <div className="rcr_image_header">
              <a className={`rcr_image_wrapper ${ReduxProductImage.onHover || payload.productImage.onHover ? "rcr_hover_mode" : ""}`}
              >
                {media?.nodes.map((item, index) => (
                  <img
                    key={index}
                    className={`productImage recora_Image_${index}`}
                    src={item?.preview?.image?.url}
                    style={{
                      objectFit: (ReduxProductImage.cropImage || payload.productImage.cropImage)
                        ? "cover"
                        : "contain",
                      objectPosition: `${ReduxProductImage.cropType || payload.productImage.cropType}  center`,
                    }}
                  />
                ))}
              </a>
            </div>
            <div className="rcr_card__content">
              {(ReduxProductCard.showVendor || payload.productCard.showVendor) && (
                <p className={`rcr_product_vendor`}>{vendor}</p>
              )}
            {(ReduxProductTitle.showTitle || payload.productTitle.showTitle) && (
              <h2 className={`rcr_product_title ${(ReduxProductTitle.titleClip || payload.productTitle.titleClip) ? "rcr_truncate" : ""}`}>
                {title}
              </h2>              
            )}

            { ((ReduxProductPrice.showPrice || payload.productPrice.showPrice) || (ReduxProductPrice.comparePrice.showComparePrice || payload.productPrice.comparePrice.showComparePrice)) && (
              <div className="rcr_product_price_wrappper">
                {(ReduxProductPrice.showPrice || payload.productPrice.showPrice) && (
                   <p className={`rcr_product_price`}>
                      2.00
                    </p>
                )}
              {(ReduxProductPrice.comparePrice.showComparePrice || payload.productPrice.comparePrice.showComparePrice) && (
                   <p className={`rcr_product_com_price`}>
                      2.00
                    </p>
                )}
              </div>              
            )}

            </div>
          </li>
        );
      })}
    </ul>
{/* <Button variant="primary" icon={landscape ? Landscape : Landscape} onClick={toggleOrientation}></Button> */}


{previewStyle == "tablet"  && 
<button className="toggle-btn" id="toggleBtn" onClick={toggleOrientation}><Landscape width="25" height="25"/></button>
}


</div>
</div>
{previewStyle =="desktop" && (
  <div className="desktop-footer"><img width="100px" src="https://cdn.prod.website-files.com/61f440a1f86f74c9d0007b4c/61f89c0e14ac27c05da734c6_recora-logo.svg"/></div>
)}
</>
  );
}

export default DesktopPreview;
