import { ChangeEvent, Component } from 'react'
import styled from '../../theme'

interface Props {
  className?: string
  type: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

class Element extends Component<Props, object> {
  render() {
    return <input type={this.props.type} className={this.props.className} onChange={this.props.onChange} />
  }
}

const StyledInput = styled(Element)`
  width: 400px;
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