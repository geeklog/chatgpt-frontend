import './Loading.css';

function Loading({style}: {style: any}) {
  return (
    <div className="loading" style={style}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default Loading;