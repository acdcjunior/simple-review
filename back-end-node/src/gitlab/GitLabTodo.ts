export class GitLabTodo {

    public readonly id: number;
    public readonly project: any;
    public readonly author: any;
    public readonly action_name: string; // "mentioned",
    public readonly target_type: string; // "Commit",
    public readonly target: any;
    public readonly target_url: string; // "http://ac4a1d666574/sti/sagas2/commit/34ea378cb974e37e845b7604d8aa2f72d5c367f5#note_114",
    public readonly body: string; // "QQQQQQQQ @fernandesm ",
    public readonly state: string; // ["pending", "done"]
    public readonly created_at: string; // "2017-04-29T18:30:37.757Z"

}