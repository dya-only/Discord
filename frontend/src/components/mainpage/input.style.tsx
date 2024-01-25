import { ChangeEvent, Component } from 'react'
import styled from '../../theme'

interface Props {
  className?: string
  type: string
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

class Element extends Component<Props, object> {
  render() {
    return <input type={this.props.type} className={this.props.className} placeholder={this.props.placeholder} onChange={this.props.onChange} />
  }
}

const StyledInput = styled(Element)`
  width: 388px;
  height: 20px;
  background: #1e1f22;
  border-radius: 4px;
  outline: none;
  border: none;
  color: white;
  font-size: 16px;
  padding: 10px;
`

export default StyledInput