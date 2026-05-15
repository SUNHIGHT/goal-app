import { useGoals } from '../../hooks/useGoals';
import Panel from "../atoms/Panel"

export function Dashboard() {

    const {
        completedGoals,
        activeGoals,
        overdueGoals
    } = useGoals();


    return (
        <>
            <div className="section">
                <div className="section-header">
                    <h2>現在進行中</h2>
                    <div className="section-line"></div>
                </div>

                <div className='main-grid'>
                    {activeGoals.map(item => (
                        <Panel key={item.id}>
                            {item.goal}
                        </Panel>
                    ))}
                </div>
            </div>
            <div className="section">
                <div className="section-header">
                    <h2>期限切れ</h2>
                    <div className="section-line"></div>
                </div>

                <div className='main-grid'>
                    {overdueGoals.map(item => (
                        <Panel key={item.id}>
                            {item.goal}
                        </Panel>
                    ))}
                </div>
            </div>
            <div className="section">
                <div className="section-header">
                    <h2>完了済み</h2>
                    <div className="section-line"></div>
                </div>

                <div className='main-grid'>
                    {completedGoals.map(item => (
                        <Panel key={item.id}>
                            {item.goal}
                        </Panel>
                    ))}
                </div>
            </div>
        </>
    )
}