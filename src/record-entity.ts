interface RecordEntity extends Document{
    key: String;
    value: String;
    createdAt: Date;
    counts: [number];
}