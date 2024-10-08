module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      author: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM('published', 'draft'),
        defaultValue: 'draft',
      },
      read_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      reading_time: {
        type: DataTypes.INTEGER,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'posts',
      timestamps: true,
      underscored: true,
    },
  );

  return Post;
};
