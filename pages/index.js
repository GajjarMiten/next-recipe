import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";

export const getStaticProps = async () => {
    const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });

    const entries = await client.getEntries({
        content_type: "recipe",
    });

    return {
        props: {
            recipes: entries.items,
        },
        revalidate: 1,
    };
};

export default function Recipes({ recipes }) {
    return (
        <div className="recipe-list">
            {recipes.map((recipe) => {
                return <RecipeCard recipe={recipe} key={recipe.sys.id} />;
            })}

            <style jsx>
                {`
                    .recipe-list {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-gap: 20px;
                    }
                `}
            </style>
        </div>
    );
}
