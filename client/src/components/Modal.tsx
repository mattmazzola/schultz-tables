import * as React from 'react'
import * as ReactDOM from 'react-dom'

const modalRoot: HTMLElement = document.getElementById('modal-root')!;

export default class Modal extends React.Component<{}, {}> {
    element: HTMLElement

    constructor(props: {}) {
        super(props)
        this.element = document.createElement('div')
    }

    componentDidMount() {
        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        modalRoot.appendChild(this.element);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.element);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.element,
        );
    }
}