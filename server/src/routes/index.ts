import { Route } from "../util/route"
import { register } from "../controller/index"

export = [new Route({
    cmd:'register',
    handler: [register],
    method: "post"
})]
