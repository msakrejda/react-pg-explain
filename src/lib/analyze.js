
function selfCost(node) {
  return node['Total Cost'] - (node['Plans'] || []).map(p => p['Total Cost']).reduce((totCost, currCost) => totCost + currCost, 0)
}

function flattenNodes(node) {
  let result = [ node ]
  const subNodes = node['Plans'] || []
  subNodes.forEach((child) => {
    const children = flattenNodes(child)
    result = result.concat(children)
  })
  return result
}

export function findMostExpensiveByCost (plan) {
  const rootNode = plan[0]['Plan']
  const nodes = flattenNodes(rootNode)
  
  let mostExpensive = {
    node: rootNode,
    cost: selfCost(rootNode),
  }
  nodes.forEach((node) => {
    const cost = selfCost(node)
    if (cost > mostExpensive.cost) {
      mostExpensive = {
        node,
        cost,
      }
    }
  })

  return {
    [mostExpensive.node.__location]: [ `this is expensive: ${mostExpensive.cost}` ]
  }
}
