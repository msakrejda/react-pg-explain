import React, { useState } from 'react'
import { Object } from 'es6-shim';

const debug = false

export function addLocations (node, currLocation=[0]) {
  node.__location = currLocation
  if (!node.Plans) {
    return
  }
  node.Plans.forEach((child, i) => {
    addLocations(child, currLocation.concat(i))
  })
}

function NodeDetails ({details}) {
  return <div style={{backgroundColor: 'white', borderWidth: 1}}>
    <dl>
      {Object.entries(details).filter(([key]) => !key.startsWith('__')).map(([key, value]) => {
        return <>
          <dt style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{key}</dt>
          <dd style={{marginLeft: '10px', fontFamily: 'monospace'}}>{value}</dd>
        </>
      })}
    </dl>
  </div>
}

function Node ({ node, annotations }) {
  const { Plans, ...rest } = node
  const style = {
    padding: '8px 32px',
    fontFamily: 'sans-serif'
  }
  if (debug) {
    style.borderWidth = 1
  }

  const [ expanded, expand ] = useState(false)
  const toggleExpand = () => expand(expanded => !expanded)

  const myAnnotations = annotations[node.__location] || []
  const relName = rest['Relation Name']
  const nodeType = rest['Node Type']
  const heading = relName ? `${nodeType} on ${relName}` : nodeType
  const width = expanded ? 600 : 300
  return (
    <div style={style}>
      <div onClick={toggleExpand} style={{borderWidth: 1, borderStyle: 'solid', borderColor: 'red', maxWidth: width, padding: '4px'}}>
        <div style={{fontWeight: 'bold', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} title={heading}>{heading}</div>
        <div>cost: {rest['Startup Cost']}...{rest['Total Cost']}</div>
        {expanded && <NodeDetails details={rest} />}
        {myAnnotations.map((a) => {
          return <div>{a}</div>
        })}
      </div>
      <div>
        {Plans && Plans.map((p) => {
          return <Node node={p} annotations={annotations} />
        })}
      </div>
    </div>
  )
}

export default function Explain ({plan, annotations}) {
  return (
    <div style={{position: 'relative', overflow: 'scroll'}}>
      <Node node={plan[0].Plan} annotations={annotations}/>
    </div>
  )
}