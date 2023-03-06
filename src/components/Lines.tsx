import React from "react";

function Lines({children}: {children: string}) {
  const lines = children.split('\n');
  return (
    <div>
      {lines.map((line, index) => 
        <React.Fragment key={index}>
          {line}
          {index !== lines.length - 1 && <br/>}
        </React.Fragment>
      )}
    </div>
  )
}

export default Lines;