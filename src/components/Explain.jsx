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

function RelationInfo ({ node }) {
  const relName = node['Relation Name']
  const relSchema = node['Schema']
  const relAlias = node['Alias']
  const relColor = 'darkolivegreen'
  const schemaColor = relColor
  const aliasColor = relColor
  const title = `on ${relSchema}.${relName} AS ${relAlias}`
  return relName ? (
    <div style={{fontSize: '0.8rem', paddingLeft: '12px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} title={title}>
      on <span style={{color: schemaColor}}>{relSchema}</span>.<span style={{color: relColor}}>{relName}</span> AS <span style={{color: aliasColor}}>{relAlias}</span>
    </div>
  ) : null
}

function NodeHeading ({ node }) {
  const nodeType = node['Node Type']
  return <div style={{fontWeight: 'bold', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} title={nodeType}>{nodeType}</div>
}

function NodeAnnotations ({ annotations }) {
  return annotations.map((annotation, index) => {
    return <div key={index}>{annotation.badge}</div>
  })
}

const nodeLineColor = '#512903'

function Node ({ node, annotations, onNodeClick }) {
  const { Plans, ...rest } = node

  const myAnnotations = annotations[node.__location] || []

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
        borderColor: nodeLineColor,
        borderRadius: '5px',
        backgroundColor: 'snow',
        color: nodeLineColor,
        maxWidth: 300,
        padding: '4px'
        }}>
        <NodeHeading node={node} />
        <RelationInfo node={node} />
        <NodeAnnotations annotations={myAnnotations} />
        <div>cost: {rest['Startup Cost']}...{rest['Total Cost']}</div>
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
  const [ expanded, expand ] = useState(true)
  const toggleExpand = () => expand(expanded => !expanded)

  if (!React.Children.count(children)) {
    return null
  }

  return (
    <div style={{
      marginLeft: '18px'
    }}>
      <div style={{
        borderLeft: '1px solid',
        borderColor: nodeLineColor,
        height: '12px',
        }} />
      <span style={{
        border: '1px solid',
        color: nodeLineColor,
        borderColor: nodeLineColor,
        marginLeft: '-6px',
        borderRadius: '2px',
        cursor: 'pointer'
      }}
        title={`${expanded ? 'collapse' : 'expand'} children`}
        onClick={toggleExpand}>{expanded ? '−' : '+'}</span>
      {expanded && children}
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
          borderColor: nodeLineColor,
          borderBottomLeftRadius: lastNode ? '5px' : undefined,
          height: '20px',
          width: '20px',
        }} />
        {lastNode ? null : <div style={{
          borderLeft: '1px solid',
          borderColor: nodeLineColor,
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

export function Explain ({plan, annotations, onNodeClick, style}) {
  return (
    <div style={{position: 'relative', overflow: 'scroll', ...style}}>
      <Node node={plan[0].Plan} annotations={annotations} onNodeClick={onNodeClick} />
    </div>
  )
}

export function ExplainPlanOverview ({plan, annotations}) {
  const [ selectedNode, setSelectedNode ] = useState(plan[0].Plan)
  const handleNodeClick = (node) => {
    setSelectedNode(node)
  }
  const { Plans, ...nodeDetails } = selectedNode
  const nodeAnnotations = annotations[selectedNode.__location] || []

  return (
    <div style={{display: 'flex'}}>
      <Explain style={{flexGrow: 1}} plan={plan} annotations={annotations} onNodeClick={handleNodeClick} />
      <NodeDetails style={{flexGrow: 1}} node={nodeDetails} annotations={nodeAnnotations} />
    </div>
  )
}

function NodeDetails ({node, style, annotations}) {
  return (
    <div>
      <NodeHeading node={node} />
      <RelationInfo node={node} />
      <div style={{
        backgroundColor: 'white',
        borderWidth: 1,
        width: '500px',
        ...style
        }}>
        {annotations.length > 0 && (
          <div>
            Analysis:
            <ul>
              {annotations.map(a => {
                return <li>{a.detail}</li>
              })}
            </ul>
          </div>
        )}
        Details:
        <dl>
          {Object.entries(node).filter(([key]) => !key.startsWith('__')).map(([key, value]) => {
            const displayValue = Array.isArray(value)
              ? value.join(', ')
              : value === false || value === true
              ? String(value)
              : value
            return <>
              <dt key={`dt-${key}`} style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{key}</dt>
              <dd key={`dd-${key}`} style={{marginLeft: '10px', fontFamily: 'monospace'}}>{displayValue}</dd>
            </>
          })}
        </dl>
      </div>
    </div>
  )
}