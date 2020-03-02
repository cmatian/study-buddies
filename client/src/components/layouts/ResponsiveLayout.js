// Based on https://github.com/pdeona/responsive-layout-hooks/blob/master/src/components/ResponsiveLayout/index.js

import { useWindowSize } from '../../WindowSizeContext'

const ResponsiveLayout = ({ breakPoint = 400, renderMobile, renderDesktop }) => {
  const { width } = useWindowSize()
  return width > breakPoint ? renderDesktop() : renderMobile()
}

export default ResponsiveLayout;
