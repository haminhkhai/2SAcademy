type Props = {
  isModal?: boolean;
}
export default function LoadingFull(props : Props) {
  return (
    <div className={"loading-full" + (props.isModal ? ' loading-full--modal' : '')}>
      <div className="loading-full__box">
        <img src="/img/logo.svg" alt="logo" className="loading-full__logo" />
        <img src="/img/logo-text.svg" alt="logo" className="loading-full__logo-text" />
      </div>
    </div>
  )
  
}