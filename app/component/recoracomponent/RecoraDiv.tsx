import React , { CSSProperties , ReactNode} from 'react'

type RecoraDivProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}; 
const RecoraDiv : React.FC<RecoraDivProps> = ({className ,  style , children}) => {
  return (
    <div className={`${className}`} style={style}>
        {children}
    </div>
  )
}
export default RecoraDiv
