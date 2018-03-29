import multiprocessing as mp
import sys
import platform
import time
from crawler import Crawler
			
def main():
        out = open('output.json', 'w')
        out.write('[\n')
        crawler = Crawler()
        print('crawler created')
        if platform.system() == 'Windows':
                mp.set_start_method('spawn')
        else:
                mp.set_start_method('fork')
        processes = 8
        pool = mp.Pool(processes = processes)
        print('%d processes spawned' %processes)

        def exit():
                print('exiting...')
                crawler.output(out)
                out.write('\n]')
                print('%d games crawled' %crawler.game_counter)
                print('missed list urls:')
                crawler.print_list_links()
                print('missed game urls:')
                crawler.print_game_links()
	
        while True:
                try:
                        if crawler.urls:
                                pool.apply_async(crawler.game_list_parse, (crawler.urls.pop(0),), callback = crawler.collect_links)
                        elif crawler.game_links:
                                pool.apply_async(crawler.game_page_parse, (crawler.game_links.pop(0),), callback = crawler.collect_games)                                
                        crawler.output(out)
                                
                except KeyboardInterrupt:
                        print('keyboard interrupt catched')
                        exit()
                        raise KeyboardInterrupt
			
		
if __name__ == '__main__':
    main()
