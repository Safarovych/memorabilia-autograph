import { redirect } from 'next/navigation';
import PageShell from '../../components/PageShell';
import { getCurrentUser } from '../../lib/auth';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?admin=1');
  if (user.role !== 'ADMIN') redirect('/');

  return <PageShell>
    <main className="section adminPanel">
      <div className="adminHeader">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Админ-панель</h1>
          <p>Управление товарами, аукционами, заказами и пользователями.</p>
        </div>
        <form action="/api/auth/logout" method="post"><button className="btn" type="submit">Выйти</button></form>
      </div>
      <div className="adminGrid"><a className="adminCard" href="/admin/products"><strong>Товары</strong><span>Добавление и редактирование</span></a>
        
        <div className="adminCard"><strong>Аукционы</strong><span>Лоты, ставки и сроки</span></div>
        <div className="adminCard"><strong>Заказы</strong><span>Заказы и статусы оплаты</span></div>
        <div className="adminCard"><strong>Пользователи</strong><span>Аккаунты и роли</span></div>
      </div>
    </main>
  </PageShell>
}
