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

function NodeDetails ({details, onClose}) {
  function handleClose (e) {
    e.preventDefault()
    onClose()
  }
  const { 'Node Type': nodeType, ...rest } = details
  return <div style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1}}>
    <a href='#' onClick={handleClose}>x</a>
    <strong>{nodeType}</strong>
    <dl>
      {Object.entries(rest).map(([key, value]) => {
        return <>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </>
      })}
    </dl>
  </div>
}

function Node ({ node, annotations }) {
  const { Plans, ...rest } = node
  const style = {
    padding: 20,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  if (debug) {
    style.borderWidth = 1
  }

  const [ expanded, expand ] = useState(false)
  const toggleExpand = () => expand(expanded => !expanded)

  const myAnnotations = annotations[node.__location] || []
  return (
    <div style={style}>
      {expanded && <NodeDetails details={rest} onClose={toggleExpand} />}
      <div onClick={toggleExpand} style={{borderWidth: 1, borderColor: 'red', maxWidth: 200, margin: '0 auto', textAlign: 'center', padding: '10px 0px'}}>
        <strong>{rest['Node Type']}</strong>
        {myAnnotations.map((a) => {
          return <div>{a}</div>
        })}
      </div>
      <div style={{display: 'flex'}}>
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