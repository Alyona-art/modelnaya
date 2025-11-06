/**
 * Utility to load and parse SVG elements from modelnaya-v2.svg
 */

export const loadSVGElements = async () => {
  try {
    console.log('Loading SVG from /modelnaya-v2.svg');
    const response = await fetch('/modelnaya-v2.svg');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const svgText = await response.text();
    console.log('SVG loaded, parsing...');
    
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    // Check for parsing errors
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`SVG parsing error: ${parserError.textContent}`);
    }
    
    // Extract elements from different layers
    const elements = {
      speed: extractGroupElements(svgDoc, 'speed'),
      outline: extractGroupElements(svgDoc, 'outline'),
      stops: extractGroupElements(svgDoc, 'stops'),
      turns: extractGroupElements(svgDoc, 'turns'),
      uTurns: extractGroupElements(svgDoc, 'u-turns')
    };
    
    console.log('SVG elements loaded:', elements);
    return elements;
  } catch (error) {
    console.error('Error loading SVG:', error);
    return null;
  }
};

const extractGroupElements = (svgDoc, groupId) => {
  const group = svgDoc.querySelector(`#${groupId}`);
  if (!group) return [];
  
  const elements = [];
  const children = group.children;
  
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const elementData = {
      tagName: child.tagName,
      id: child.id,
      className: child.className,
      attributes: {}
    };
    
    // Extract all attributes
    for (let j = 0; j < child.attributes.length; j++) {
      const attr = child.attributes[j];
      elementData.attributes[attr.name] = attr.value;
    }
    
    elements.push(elementData);
  }
  
  return elements;
};

export const createInteractiveElement = (elementData, onHover, onClick) => {
  const { tagName, id, className, attributes } = elementData;
  
  // Create the element with all original attributes
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  
  // Set all attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Add interactive classes and event handlers
  element.classList.add('cursor-pointer', 'transition-all', 'duration-200');
  element.addEventListener('mouseenter', () => onHover(id, true));
  element.addEventListener('mouseleave', () => onHover(id, false));
  element.addEventListener('click', (e) => onClick(id, e));
  
  return element;
};
