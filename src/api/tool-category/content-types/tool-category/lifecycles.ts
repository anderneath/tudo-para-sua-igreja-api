import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    debugger;
    await generateSlug(event);
  },

  async beforeUpdate(event) {
    await generateSlug(event);
  },
};

const generateSlug = async (event) => {
  const { data } = event.params;
  const id = event.params?.where?.id;
  const locale = !id ? data.locale : await getLocale(id);

  const res = await strapi.service("api::tool-category.tool-category").find({
    locale,
    filters: {
      slug: {
        $eq: data.slug,
      },
    },
  });
  const slugAlreadyExists = res.results.length > 0;
  if (slugAlreadyExists) {
    throw new ApplicationError("Slug já registrado!");
  }
};

const getLocale = async (id: string) => {
  const res = await strapi
    .service("api::tool-category.tool-category")
    .findOne(id);
  return res.locale;
};
