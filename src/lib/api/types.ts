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

type UserAddress = {
    city: string,
    state: string,
    street_name: string,
    street_number: number,
    zip: number
}

type User = {
    id: string,
    address: UserAddress,
    email: string,
    first_name: string,
    last_name: string,
    friend_requests: string[],
    friends: string[],
    nessie_account: string,
    nessie_customer: string,
    pools: string[]
}