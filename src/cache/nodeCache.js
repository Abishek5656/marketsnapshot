import NodeCache from "node-cache";

// default TTL = 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

export default cache;
