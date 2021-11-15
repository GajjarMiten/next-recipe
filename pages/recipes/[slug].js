import { createClient } from "contentful";
import Image from "next/image";

import Skeleton from "../../components/Skeleton";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const getStaticPaths = async () => {
    const { items: recipes } = await client.getEntries({
        content_type: "recipe",
    });

    const paths = recipes.map((recipe) => {
        return {
            params: {
                slug: recipe.fields.slug,
            },
        };
    });

    return {
        paths,
        fallback: true,
    };
};

export const getStaticProps = async ({ params }) => {
    const recipe = await client.getEntries({
        content_type: "recipe",
        "fields.slug": params.slug,
    });

    return {
        props: {
            recipe: recipe.items[0],
        },
        revalidate: 1,
    };
};

export default function RecipeDetails({ recipe }) {
    if (!recipe) {
        return <Skeleton />;
    }

    const { title, ingredients, featureImage, method, cookingTime } =
        recipe.fields;

    return (
        <div>
            <div className="banner">
                <Image
                    src={"https:" + featureImage.fields.file.url}
                    alt={featureImage.fields.title}
                    width={featureImage.fields.file.details.image.width}
                    height={featureImage.fields.file.details.image.height}
                />
                <h2>{title}</h2>
            </div>
            <div className="info">
                <p>Take about {cookingTime} mins to cook.</p>
                <h3>Ingredients:</h3>
                {ingredients.map((ingredient, index) => {
                    return <span key={ingredient}>{ingredient}</span>;
                })}
            </div>
            <div className="method">
                <h3>Method:</h3>
                {documentToReactComponents(method)}
            </div>
            <style jsx>{`
                h2,
                h3 {
                    text-transform: uppercase;
                }
                .banner h2 {
                    margin: 0;
                    background: #fff;
                    display: inline-block;
                    padding: 20px;
                    position: relative;
                    top: -60px;
                    left: -10px;
                    transform: rotateZ(-1deg);
                    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
                }
                .info p {
                    margin: 0;
                }
                .info span::after {
                    content: ", ";
                }
                .info span:last-child::after {
                    content: ".";
                }
            `}</style>
        </div>
    );
}
