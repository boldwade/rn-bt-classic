export interface RandomUser {
    dob: { age: string; date: string };
    email: string;
    login: { md5: string },
    name: { first: string; last: string; title: string };
    picture: any;
    showDate?: boolean;
}

export class RandomUserService {
    public async GetRandomUsers(count: number): Promise<Array<RandomUser>> {
        try {
            const res = await fetch(`https://randomuser.me/api?results=${count}`);
            const result = await res.json();
            if (result?.results?.length) {
                return result.results;
            } else {
                return [];
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}
