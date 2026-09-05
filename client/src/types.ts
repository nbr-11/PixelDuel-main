

type DuelFormType = {
    title?: string,
    description?: string,
}

type DuelFormTypeError = {
    title?: string,
    description?: string,
    expire_at?: string,
    image?: string
}

type duelResponseType = {
    id: number,
    userId: number,
    title: string,
    description: string,
    image: string,
    created_at: string,
    expire_at: string,
    DuelItem: Array<DuelItem>,
    DuelComment: Array<DuelComment>
}

type duelItemFormType = {
    image: File | null
}

type DuelItem = {
    id: number,
    count: number,
    image: string,
}

type DuelComment = {
    duelId: number,
    id?: number,
    comment: string,
    created_at: string
}