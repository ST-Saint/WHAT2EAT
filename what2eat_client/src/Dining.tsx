import DiningEditor from './DiningEditor';
import DishEditor from './DishEditor';
import NavigationBar from './NavigationBar';

const Dining = () => {
    return (
        <>
            <NavigationBar />
            <DiningEditor
                setDining={(value: string) => {
                    // setValue('dining', value);
                }}
            />
            <DishEditor />
        </>
    );
};

export default Dining;
