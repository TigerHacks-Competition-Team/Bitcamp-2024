type PoolMember = {
    due: number,
    paid: number,
    user_id: string
}

type Pool = {
    id: string,
    manager: string,
    members: PoolMember[],
    merchant: string,
    name: string,
    paid: number,
    prog: number,
    target: number
}