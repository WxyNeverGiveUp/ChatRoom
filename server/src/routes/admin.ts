import { Route } from "../util/route"
import { getAdmins, addAdmin, getStatus } from "../controller/admin"

export = [new Route({
    cmd: 'getAll',
    handler: [getAdmins],
    method: 'get'
}), new Route({
    cmd: 'add',
    handler: [addAdmin],
    method: 'post'
}), new Route({
    cmd: 'getStatus',
    handler: [getStatus],
    method: 'get'
})] 