import React, { useState } from 'react'

export function addLocations (node, currLocation=[0]) {
  node.__location = currLocation.join('-')
  if (!node.Plans) {
    return
  }
  node.Plans.forEach((child, i) => {
    addLocations(child, currLocation.concat(i))
  })
}

// bring back to Node for expanding children
//const [ expanded, expand ] = useState(false)
//const toggleExpand = () => expand(expanded => !expanded)

function Node ({ node, annotations, onNodeClick }) {
  const { Plans, ...rest } = node

  const myAnnotations = annotations[node.__location] || []
  const relName = rest['Relation Name']
  const nodeType = rest['Node Type']
  const heading = relName ? `${nodeType} on ${relName}` : nodeType
  const handleNodeClick = () => {
    onNodeClick(node)
  }

  return (
    <div style={{
      fontFamily: 'sans-serif',
    }}>
      <div onClick={handleNodeClick} style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'brown',
        borderRadius: '5px',
        maxWidth: 300,
        padding: '4px'
        }}>
        <div style={{fontWeight: 'bold', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} title={heading}>{heading}</div>
        <div>cost: {rest['Startup Cost']}...{rest['Total Cost']}</div>
        {myAnnotations.map((a, index) => {
          return <div key={index}>{a}</div>
        })}
      </div>
      <NodeChildren>
        {Plans && Plans.map((p, index) => {
          return (
            <ChildNode key={index} lastNode={index === Plans.length - 1}>
              <Node node={p} annotations={annotations} onNodeClick={onNodeClick} />
            </ChildNode>
          )
        })}
      </NodeChildren>
    </div>
  )
}

function NodeChildren ({children}) {
  if (!React.Children.count(children)) {
    return null
  }
  return (
    <div style={{
      marginLeft: '12px'
    }}>
      <div style={{
        borderLeft: '1px solid',
        borderColor: 'black',
        height: '20px',
        }} />
      {children}
    </div>
  )
}

function ChildNode ({children, lastNode}) {
  return (
    <div style={{
      paddingBottom: '8px',
      display: 'flex'
    }}>
      <div>
        <div style={{
          borderLeft: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'black',
          borderBottomLeftRadius: lastNode ? '5px' : undefined,
          height: '20px',
          width: '20px',
        }} />
        {lastNode ? null : <div style={{
          borderLeft: '1px solid',
          borderColor: 'black',
          height: '100%'
        }}/>}
      </div>
      <div style={{
      }}>
        {children}
      </div>
    </div>
  )
}

export function Explain ({plan, annotations, onNodeClick}) {
  return (
    <div style={{position: 'relative', overflow: 'scroll'}}>
      <Node node={plan[0].Plan} annotations={annotations} onNodeClick={onNodeClick} />
    </div>
  )
}

export function ExplainPlanOverview ({plan, annotations}) {
  const [ selectedNode, setSelectedNode ] = useState(plan[0].Plan)
  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }
  const { Plans, ...rest } = selectedNode
  let nodeDetails = rest

  return (
    <div style={{display: 'flex'}}>
      <Explain plan={plan} annotations={annotations} onNodeClick={handleNodeClick} />
      <div>
        {nodeDetails && <NodeDetails details={nodeDetails} />}
      </div>
    </div>
  )
}

function NodeDetails ({details}) {
  return <div style={{
    backgroundColor: 'white',
    borderWidth: 1,
    maxWidth: '300px'
    }}>
    <dl>
      {Object.entries(details).filter(([key]) => !key.startsWith('__')).map(([key, value]) => {
        const displayValue = Array.isArray(value) ? value.join(', ') : value
        return <>
          <dt key={`dt-${key}`} style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{key}</dt>
          <dd key={`dd-${key}`} style={{marginLeft: '10px', fontFamily: 'monospace'}}>{displayValue}</dd>
        </>
      })}
    </dl>
  </div>
}