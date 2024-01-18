import { Component } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  name: string
}

class Element extends Component<Props, object> {
  render() {
    return <div className={this.props.className}>
      <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#80848e" fillRule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clipRule="evenodd"></path></svg>
      {this.props.name}
    </div>
  }
}

const Channel = styled(Element)`
  width: 215px;
  height: 32px;
  margin-left: 8px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border-radius: 5px;
  color: rgb(148, 155, 164);

  &:hover {
    background: #37373c;
    color: rgb(220, 220, 220);
  }
`

export default Channel