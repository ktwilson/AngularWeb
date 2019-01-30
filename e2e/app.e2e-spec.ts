import { HomeAppPage } from './app.po';

describe('home-app App', () => {
  let page: HomeAppPage;

  beforeEach(() => {
    page = new HomeAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
