import { Button, Icon, Text } from "@shopify/polaris";
import React, { useState } from "react";
import "./CSS/DesktopPreview.css";
import { v4 as uuidv4 } from "uuid";
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
  console.log(payload, "payload desktop");


  const [ landscape ,  setLandscape] = useState(false)

function toggleOrientation() {
 setLandscape(prev => !prev)
}


  const uniqueKey = uuidv4();
  const rootCSS = {
    "--rcr_card_textAlignType":payload.productCard.textAlignType,


    "--rcr_product_per_Dekview": payload.commanView.desktop.rangeProValue,
    // "--rcr_product_desk_viewType": payload.commanView.desktop.viewType,
    
    "--rcr_product_per_Mobview": payload.commanView.mobile.rangeProValue,
    // "--rcr_product_mob_viewType": payload.commanView.mobile.viewType,


     "--rcr_product_per_Tabview": payload.commanView.tablet.rangeProValue,
    // "--rcr_product_tab_viewType": payload.commanView.tablet.viewType,

    "--rcr_product_image_size": payload.productImage.ratio,
    "--rcr_product_image_padding": `${payload.productImage.padding}px`,


    // heading 
"--rcr_heading_textAlignType":payload.commanView.heading.textAlign,
"--rcr_heading_size": `${payload.commanView.heading.fontSize}`,
    "--rcr_heading_color": payload.commanView.heading.color,


    // subHeading 
    "--rcr_subHeading_textAlignType":payload.commanView.subHeading.textAlign,
"--rcr_subHeading_size": `${payload.commanView.subHeading.fontSize}`,
    "--rcr_subHeading_color": payload.commanView.subHeading.color,

    // Title
    "--rcr_product_title_size": `${payload.productTitle.fontSize}`,
    "--rcr_product_title_color": payload.productTitle.color,


// Price
"--rcr_product_price_size": `${payload.productPrice.fontSize}`,
"--rcr_product_price_color": payload.productPrice.color,
"--rcr_product_com_price_color": payload.productPrice.comparePrice.color,
"--rcr_product_com_price_size": `${payload.productPrice.comparePrice.fontSize}`,


  };
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
      className={`recoraRightPreview recora_preview_${previewStyle} recora_layoutValue_${payload.commanView[previewStyle].viewType}`}
      
    >
      {products.slice(0,6).map((item) => {
        const { id, title, media, variants, vendor } = item.node;
        return (
          <li key={id} className={`recora_Card recr_style_${payload.productCard.cardStyle}`}>
            <div className="rcr_image_header">
              <a className={`rcr_image_wrapper ${payload.productImage.onHover ? "rcr_hover_mode" : ""}`}
              >
                {media?.nodes.map((item, index) => (
                  <img
                    key={index}
                    className={`productImage recora_Image_${index}`}
                    src={item?.preview?.image?.url}
                    style={{
                      objectFit: payload.productImage.cropImage
                        ? "cover"
                        : "contain",
                      objectPosition: `${payload.productImage.cropType}  center`,
                    }}
                  />
                ))}
              </a>
            </div>
            <div className="rcr_card__content">
              {payload.productCard.showVendor && (
                <p className={`rcr_product_vendor`}>{vendor}</p>
              )}
            {payload.productTitle.showTitle && (
              <h2 className={`rcr_product_title ${payload.productTitle.titleClip ? "rcr_truncate" : ""}`}>
                {title}
              </h2>              
            )}

            { (payload.productPrice.showPrice || payload.productPrice.comparePrice.showComparePrice) && (
              <div className="rcr_product_price_wrappper">
                {payload.productPrice.showPrice  && (
                   <p className={`rcr_product_price`}>
                      2.00
                    </p>
                )}
              {payload.productPrice.comparePrice.showComparePrice && (
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
