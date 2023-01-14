import App from './App'
import {ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator'
import {HashRouter} from "react-router-dom";

export default {
  title: 'App Stories',
  component: App,
  decorators: [ReduxStoreProviderDecorator]
}

export const AppBaseExample = (props: any) => {
  return (<HashRouter><App demo={true}/></HashRouter>)
}
