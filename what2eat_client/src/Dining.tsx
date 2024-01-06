import NavigationBar from './NavigationBar';
import DiningEditor from './DiningEditor';
import DishEditor from './DishEditor';

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
    )
}

export default Dining;
