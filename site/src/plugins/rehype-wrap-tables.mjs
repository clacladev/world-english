// Wrap each <table> in <div class="table-wrap"> so wide, table-heavy specs can
// scroll horizontally on small screens without the page body overflowing.
import { visit } from 'unist-util-visit';

export default function rehypeWrapTables() {
  return function transformer(tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === null) return;
      if (parent.type === 'element' && parent.properties?.className?.includes?.('table-wrap')) {
        return;
      }
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [node],
      };
    });
  };
}
