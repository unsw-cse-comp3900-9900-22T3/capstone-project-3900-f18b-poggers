import React from "react"
import ContentLoader from "react-content-loader"

type Props = {}

const DiscoveryCardLoader = (props: Props) => (
  <ContentLoader
    speed={2}
    width={290}
    height={290}
    viewBox="0 0 290 290"
    backgroundColor="#eeeeee"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="532" y="359" rx="3" ry="3" width="88" height="6" />
    <rect x="564" y="361" rx="3" ry="3" width="52" height="6" />
    <rect x="426" y="357" rx="3" ry="3" width="410" height="6" />
    <rect x="487" y="357" rx="3" ry="3" width="380" height="6" />
    <rect x="488" y="349" rx="3" ry="3" width="178" height="6" />
    <rect x="470" y="248" rx="0" ry="0" width="178" height="162" />
    <rect x="563" y="364" rx="0" ry="0" width="149" height="1" />
    <rect x="491" y="342" rx="0" ry="0" width="118" height="42" />
    <circle cx="30" cy="30" r="20" />
    <rect x="60" y="10" rx="5" ry="5" width="230" height="15" />
    <rect x="60" y="35" rx="5" ry="5" width="150" height="15" />
    <rect x="10" y="66" rx="0" ry="0" width="280" height="171" />
    <rect x="10" y="245" rx="5" ry="5" width="80" height="20" />
  </ContentLoader>
)

export default DiscoveryCardLoader