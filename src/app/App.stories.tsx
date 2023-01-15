import App from './App'
import {ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator'
import {withRouter} from "storybook-addon-react-router-v6";

export default {
  title: 'App Stories',
  component: App,
  decorators: [ReduxStoreProviderDecorator, withRouter]
}

export const AppBaseExample = (props: any) => {
  return (<App demo={true}/>)
}
