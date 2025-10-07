import React from 'react'
const RecoraPageWrapper = ({children , style}) => {
  return (
    <div className="recora-Page_wrapper" style={style}>
        {children}
    </div>
  )
}
export default RecoraPageWrapper